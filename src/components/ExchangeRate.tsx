"use client";
import { RefersIcon } from "@/utils/svg";
import React, { useState } from "react";

const ExchangeRates = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");

  const currencies = [
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
    },
  ];

  const selectedCurrencyData = currencies.find(
    (currency) => currency.name === selectedCurrency
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exchange Rates</h1>
        <button className="p-2 rounded-full hover:bg-gray-200 w-10 h-10 flex items-center justify-center">
          {RefersIcon}
        </button>
      </div>
      <div className="flex mb-6">
        <button className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-full">
          Official Rates
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-full">
          Black Market Rates
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Currency</h2>
        <div className="flex space-x-2">
          {currencies.map((currency) => (
            <button
              key={currency.name}
              className={`px-4 py-2 rounded-full ${
                selectedCurrency === currency.name
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setSelectedCurrency(currency.name)}
            >
              {currency.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center mb-4">
          <img
            src={selectedCurrencyData?.flag}
            alt={`${selectedCurrencyData?.name} flag`}
            className="w-8 h-8 mr-2"
          />
          <h3 className="text-xl font-bold">{selectedCurrencyData?.name}</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Bank</th>
              <th className="text-left py-2">Buying</th>
              <th className="text-left py-2">Selling</th>
            </tr>
          </thead>
          <tbody>
            {selectedCurrencyData?.rates.map((rate, rateIndex) => (
              <tr key={rateIndex} className="border-b">
                <td className="py-2 flex items-center">
                  <img
                    src={rate.icon}
                    alt={`${rate.bank} icon`}
                    className="w-6 h-6 mr-2"
                  />
                  {rate.bank}
                </td>
                <td className="py-2 text-green-600">{rate.buy}</td>
                <td className="py-2 text-red-600">{rate.sell}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExchangeRates;
