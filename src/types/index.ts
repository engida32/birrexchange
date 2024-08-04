export interface BankExchangeRate {
    bank_name: string;
    bank_logo: string;
    buying_price: number;
    selling_price: number;
    currency_name: string;
    is_last_rate: boolean;
    is_latest_rate: boolean;
}

export interface BinanceExchangeRate {
    buying_price: number;
    selling_price: number;
}

export interface BinanceExchangeRateResponse {
    currency_name: string;
    rates: BinanceExchangeRate[]
}
export interface ExchangeRateResponse {
    banks: BankExchangeRateResponse[],
    binance: BinanceExchangeRateResponse[]
}


export interface BankExchangeRateResponse {
    currency_name: string;
    currency_logo: string;
    rates: BankExchangeRateLatestAndLast[]
}

export interface BankExchangeRateLatestAndLast {
    bank_name: string;
    bank_logo: string;
    rates: BankRatesResponse[]
}

export interface BankRatesResponse {
    buying_price: number;
    selling_price: number;
}

export interface BankExchangeRateHistoryResponse {
    time_range: string;
    rates: BankExchangeRate[]
}