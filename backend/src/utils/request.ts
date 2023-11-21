import express = require('express');
import { getReasonPhrase } from 'http-status-codes';

type Response<T> = {
  status: number;
  error: boolean;
  msg: string;
  date: Date;
  payload: T;
}

export function responseForger<T>(res: express.Response<Record<string, unknown>, Record<string, unknown>>) {
  const resFunc = (defRes: Partial<Response<T>> | number): void => {

    if (typeof defRes === 'number') {
      return void resFunc({ status: defRes });
    }

    const status = defRes.status ?? 200;
    const error = defRes.error ?? (status >= 400);
    const date = defRes.date ?? new Date();
    const msg = defRes.msg ?? (() => {
      try {
        return getReasonPhrase(status);
      } catch (e) {
        return 'Unknown error';
      }
    })();
    const payload = defRes.payload ?? null;

    const data: Response<T | null> = {
      status,
      error,
      msg,
      date,
      payload,
    }

    return void res.status(status).send(data).end();
  }

  return resFunc;
}
