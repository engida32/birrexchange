import { ExchangeRateResponse } from "@/types";
import cacheData from "memory-cache";

export function fetchFromCache(key:string): any {
    const value = cacheData.get(key);
    if (value) return value;
    else return null;
}

export function setToCache(key:string, value:any, duration:number) {
    cacheData.put(key, value, duration);
}