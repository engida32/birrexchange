// selectors for the currency exchange page
export const SELECTORS = {
    EXC_CURRENCY_LIST: '.exc_currency_lists',
    EXC_CURRENCY_CARD: '.exc_currency_card',
    CARD_HEADER: '.card_header',
    CURRENCY_BANK_LOGO: '.currency_bank_logo',
    CURRENCY_BANK_NAME: '.currency_bank_name',
    CURRENCY_BANK_BUYING: '.currency_bank_buying',
    CURRENCY_BANK_SELLING: '.currency_bank_selling'
} as const;


// time range for the bank exchange rate history
export const TIME_RANGES = {
    '1D': '1 Day',
    '1W': '1 Week',
    '1M': '1 Month',
    '3M': '3 Months',
    '6M': '6 Months',
    '1Y': '1 Year'
} 

export const BINANCE_HEADER = {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    // "Content-Length": "123",
    "content-type": "application/json",
    "Host": "p2p.binance.com",
    "Origin": "https://p2p.binance.com",
    "Pragma": "no-cache",
    "TE": "Trailers",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
};

export const BINANCE_BODY = {
    "fiat": "ETB",
    "page": 1,
    "rows": 10,
    "tradeType": "BUY",
    "asset": "USDT",
    "countries": [],
    "proMerchantAds": false,
    "shieldMerchantAds": false,
    "filterType": "tradable",
    "periods": [],
    "additionalKycVerifyFilter": 0,
    "publisherType": "merchant",
    "payTypes": [],
    "classifies": ["mass", "profession", "fiat_trade"],
};
