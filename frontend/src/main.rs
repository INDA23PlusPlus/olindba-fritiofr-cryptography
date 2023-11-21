mod client;
pub use crate::client::*;
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let mut client = Client::new("130.229.131.104", 3000);
    let _ = client.post("abcd", "files/test1").await;
    let ret = client.get("abcd").await;
    println!("{:?}", ret);
}