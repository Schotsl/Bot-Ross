import { hmac } from "https://deno.land/x/god_crypto/hmac.ts";

import {
  AccountsResponse,
  CurrenciesResponse
} from './interface.ts';

export class CoinbaseAPI {
  private url = 'https://api.coinbase.com';
  private key: string;
  private secret: string;

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
  }

  private generateHeaders(method: string, path: string): HeadersInit {
    const timestamp = Math.round((Date.now() / 1000)).toString();
    const concated = `${timestamp}${method}${path}`;
    const signed = hmac("sha256", this.secret, concated).hex();

    return {
      "CB-VERSION": "2021-07-14",
      "CB-ACCESS-KEY": this.key,
      "CB-ACCESS-SIGN": signed,
      "CB-ACCESS-TIMESTAMP": timestamp,
    };
  }

  private async getAbstract<T>(path: string): Promise<T> {
    const url = `${this.url}/${path}`
    const response = await fetch(url, {
      method: `GET`,
      headers: this.generateHeaders("GET", path),
    });

    return await response.json();
  }

  public getAccounts(): Promise<AccountsResponse> {
    return this.getAbstract("/v2/accounts");
  }

  public getCurrencies(): Promise<CurrenciesResponse> {
    return this.getAbstract("/v2/exchange-rates?currency=EUR");
  }
}
