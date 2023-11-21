#![allow(unused_must_use)]

use std::{fs, str, collections::HashMap};
use base64::engine::general_purpose;
use reqwest::*;
use base64::*;
use orion::aead;

pub struct Client {
    client: reqwest::Client,
    key: aead::SecretKey,
    url: Url,
    username: String,
    password: String
}

impl Client {
    pub fn new(host: &str, port: u16) -> Client {
        let mut url = Url::parse("http://example.net").unwrap();
        url.set_ip_host(host.parse().unwrap());
        url.set_port(Some(port));

        let vars = std::env::vars().collect::<HashMap<String, String>>();
        let password = vars.get("PASSWORD").unwrap().clone();
        let username = vars.get("USERNAME").unwrap().clone();

        Client {
            client: reqwest::Client::new(),
            key: aead::SecretKey::from_slice(&[0; 32]).unwrap(),
            url,
            username,
            password
        }
    }

    pub async fn get(&mut self, id: &str) -> Result<String> {

        self.url.set_path("api/v1/file");
        self.url.query_pairs_mut()
            .clear()
            .append_pair("name", id);

        use serde_json::Value;

        let body = self.client.get(self.url.clone())
            .basic_auth(self.username.clone(), Some(self.password.clone()))
            .send()
            .await?
            .json::<Value>()
            .await?;

        let value = match body {
            Value::Object(data) => match data.get("payload") {
                Some(Value::String(data)) => Some(data.clone()),
                _ => None
            }
            _ => None
        };

        if let Some(body) = value {

            match general_purpose::STANDARD.decode(body) {
                Ok(decoded) => {

                    match aead::open(&self.key, &decoded) {
                        Ok(decrypted) => {
                            return Ok(str::from_utf8(&decrypted).expect("Bytes sent from server are always of form u8").to_string());
                        },
                        Err(_) => {
                            println!("Server has modified data");
                        }
                    };
                },
    
                Err(_) => {
                    println!("Failed to decode base64 encryption");
                }
            }
        }
        else {
            println!("Failed to decode json");
        }
        Ok(String::new())
    }

    pub async fn post(&mut self, id: &str, file_path: &str) -> Result<()> {

        match fs::read(file_path) {
            Ok(bytes) => {
                
                match aead::seal(&self.key, &bytes) {
                    Ok(encrypted) => {
                        
                        //Base64 encoding
                        let encoded = general_purpose::STANDARD.encode(&encrypted);
                        println!("{}", encoded);
                        //Send to server
                        let mut map = HashMap::new();
                        map.insert("name", id);
                        map.insert("data", encoded.as_str());

                        self.url.set_path("api/v1/file");
                        let res = self.client.post(self.url.clone())
                            .basic_auth(self.username.clone(), Some(self.password.clone()))
                            .json(&map)
                            .send()
                            .await?;

                        println!("{:?}", res);
                    },
                    Err(_) => {
                        println!("Failed to encrypt data");
                    }
                }
            },
            Err(_) => {
                println!("File {} could not be read", file_path);
            }
        }
        Ok(())
    }
}