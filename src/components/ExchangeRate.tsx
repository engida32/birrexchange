"use client";
import { RefersIcon } from "@/utils/svg";
import React, { useState } from "react";
import OfficialRates from "./OfficialRates";
import BlackMarketRates from "./BlackMarketRates";
interface Rate {
  bank: string;
  icon: string;
  buy: number;
  sell: number;
}

interface CurrencyData {
  name: string;
  flag: string;
  rates: Rate[];
  blackMarketRates: {
    buy: number;
    sell: number;
  };
}

interface BlackMarketRateType {
  name: string;
  flag: string;
  buy: number;
  sell: number;
}
const officialRates: CurrencyData[] = [
  {
    name: "USD",
    flag: "https://img.icons8.com/?size=100&id=fIgZUHgwc76e&format=png&color=000000",
    rates: [
      {
        bank: "GAD",
        icon: "https://example.com/gad-icon.png",
        buy: 102.0156,
        sell: 107.1164,
      },
      {
        bank: "BOA",
        icon: "https://example.com/boa-icon.png",
        buy: 96.3738,
        sell: 107.9387,
      },
      {
        bank: "TSE",
        icon: "https://example.com/tse-icon.png",
        buy: 96.2236,
        sell: 103.9215,
      },
      {
        bank: "BRN",
        icon: "https://example.com/brn-icon.png",
        buy: 96.1716,
        sell: 104.827,
      },
      {
        bank: "CBE",
        icon: "https://example.com/cbe-icon.png",
        buy: 95.6931,
        sell: 101.4347,
      },
    ],
    blackMarketRates: {
      buy: 110.0,
      sell: 115.0,
    },
  },
  {
    name: "EUR",
    flag: "https://img.icons8.com/?size=100&id=Pe4Zziu2tVGf&format=png&color=000000",
    rates: [
      {
        bank: "GAD",
        icon: "https://example.com/gad-icon.png",
        buy: 0.8516,
        sell: 0.8721,
      },
      {
        bank: "BOA",
        icon: "https://example.com/boa-icon.png",
        buy: 0.8467,
        sell: 0.8693,
      },
      {
        bank: "TSE",
        icon: "https://example.com/tse-icon.png",
        buy: 0.8432,
        sell: 0.8625,
      },
      {
        bank: "BRN",
        icon: "https://example.com/brn-icon.png",
        buy: 0.8411,
        sell: 0.8597,
      },
      {
        bank: "CBE",
        icon: "https://example.com/cbe-icon.png",
        buy: 0.8356,
        sell: 0.8532,
      },
    ],
    blackMarketRates: {
      buy: 0.9,
      sell: 0.95,
    },
  },
  {
    name: "GBP",
    flag: "https://img.icons8.com/?size=100&id=RCGiO1IdJl7x&format=png&color=000000",
    rates: [
      {
        bank: "GAD",
        icon: "https://example.com/gad-icon.png",
        buy: 0.7316,
        sell: 0.7521,
      },
      {
        bank: "BOA",
        icon: "https://example.com/boa-icon.png",
        buy: 0.7267,
        sell: 0.7493,
      },
      {
        bank: "TSE",
        icon: "https://example.com/tse-icon.png",
        buy: 0.7232,
        sell: 0.7425,
      },
      {
        bank: "BRN",
        icon: "https://example.com/brn-icon.png",
        buy: 0.7211,
        sell: 0.7397,
      },
      {
        bank: "CBE",
        icon: "https://example.com/cbe-icon.png",
        buy: 0.7156,
        sell: 0.7332,
      },
    ],
    blackMarketRates: {
      buy: 0.77,
      sell: 0.8,
    },
  },
  {
    name: "AED",
    flag: "https://img.icons8.com/?size=100&id=p1VTmNRxfZuT&format=png&color=000000",
    rates: [
      {
        bank: "GAD",
        icon: "https://example.com/gad-icon.png",
        buy: 3.6716,
        sell: 3.6921,
      },
      {
        bank: "BOA",
        icon: "https://example.com/boa-icon.png",
        buy: 3.6667,
        sell: 3.6893,
      },
      {
        bank: "TSE",
        icon: "https://example.com/tse-icon.png",
        buy: 3.6632,
        sell: 3.6825,
      },
      {
        bank: "BRN",
        icon: "https://example.com/brn-icon.png",
        buy: 3.6611,
        sell: 3.6797,
      },
      {
        bank: "CBE",
        icon: "https://example.com/cbe-icon.png",
        buy: 3.6556,
        sell: 3.6732,
      },
    ],
    blackMarketRates: {
      buy: 3.8,
      sell: 3.85,
    },
  },
];
const blackMarketRates: BlackMarketRateType[] = [
  {
    name: "USD",
    flag: "https://img.icons8.com/?size=100&id=fIgZUHgwc76e&format=png&color=000000",
    buy: 110.0,
    sell: 115.0,
  },
  {
    name: "EUR",
    flag: "https://img.icons8.com/?size=100&id=Pe4Zziu2tVGf&format=png&color=000000",
    buy: 0.9,
    sell: 0.95,
  },
  {
    name: "GBP",
    flag: "https://img.icons8.com/?size=100&id=RCGiO1IdJl7x&format=png&color=000000",
    buy: 0.77,
    sell: 0.8,
  },
  {
    name: "AED",
    flag: "https://img.icons8.com/?size=100&id=p1VTmNRxfZuT&format=png&color=000000",
    buy: 3.8,
    sell: 3.85,
  },
];

const ExchangeRates = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedTab, setSelectedTab] = useState<string>("official");

  const selectedCurrencyData =
    selectedTab === "official"
      ? officialRates.find((currency) => currency.name === selectedCurrency)
      : blackMarketRates.find((currency) => currency.name === selectedCurrency);

  console.log("selectedCurrencyData", selectedCurrencyData);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exchange Rates</h1>
        <button className="p-2 rounded-full hover:bg-gray-200 w-10 h-10 flex items-center justify-center">
          {RefersIcon}
        </button>
      </div>
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 mr-2 rounded-full ${
            selectedTab === "official"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("official")}
        >
          Official Rates
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            selectedTab === "blackMarket"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setSelectedTab("blackMarket")}
        >
          Black Market Rates
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Currency</h2>
        <div className="flex space-x-2">
          {(selectedTab === "official" ? officialRates : blackMarketRates).map(
            (currency) => (
              <button
                key={currency.name}
                className={`px-4 py-2 rounded-full ${
                  selectedCurrency === currency.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedCurrency(currency.name);
                }}
              >
                {currency.name}
              </button>
            )
          )}
        </div>
      </div>
      {selectedTab === "official" ? (
        <OfficialRates currencyData={selectedCurrencyData} />
      ) : (
        <BlackMarketRates currencyData={selectedCurrencyData} />
      )}
    </div>
  );
};

export default ExchangeRates;
