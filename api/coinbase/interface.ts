export interface AccountsResponse {
  data: Account[];
  pagination: Pagination;
}

export interface CurrenciesResponse {
  data: {
    rates: Rates;
    currency: string;
  };
}

interface Pagination {
  limit: number;
  order: string;

  "next_uri": string | null;
  "previous_uri": string | null;
  "ending_before": string | null;
  "starting_after": string | null;
  "next_starting_after": string | null;
  "previous_ending_before": string | null;
}

interface Account {
  id: string;
  name: string;
  type: "wallet" | "fiat" | "vault";
  primary: boolean;
  balance: Balance;
  currency: Currency;
  resource: "account";

  "create_at": null | string;
  "updated_at": null | string;
  "resource_path": string;
  "allow_deposits": boolean;
  "allow_withdrawals": boolean;
}

interface Currency {
  code: string;
  name: string;
  type: string;
  slug: string;
  color: string;
  exponent: number;

  "asset_id": string;
  "sort_index": number;
  "address_regex": string;
}

interface Balance {
  amount: number;
  currency: string;
}

interface Rates {
  [key: string]: number;
}
