export interface BankExchangeRate {
    bank_name: string;
    bank_logo: string;
    buying_price: number;
    selling_price: number;
    currency_name: string;
}

export interface BinanceExchangeRate {
    currency_name: string;
    buying_price: number;
    selling_price: number;
}

export interface ExchangeRateResponse {
    banks: BankExchangeRateResponse[],
    binance: BinanceExchangeRate[]
}


export interface BankExchangeRateResponse {
    currency_name: string;
    currency_logo: string;
    rates: BankExchangeRate[]
}