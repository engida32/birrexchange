import Image from "next/image";
import React from "react";

interface CurrencyData {
  name: string;
  flag: string;
  buy: number;
  sell: number;
  officialRate?: number;
}

interface BlackMarketRatesProps {
  currencyData: CurrencyData;
}
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const calculateSpread = (buyRate: number, sellRate: number) => {
  return (((sellRate - buyRate) / buyRate) * 100).toFixed(2);
};

const BlackMarketRates: React.FC<BlackMarketRatesProps> = ({
  currencyData,
}) => {
  const { name, flag, buy, sell, officialRate } = currencyData;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Image
          src={flag}
          alt={`${name} flag`}
          className="mr-3 rounded-full shadow"
          width={40}
          height={40}
        />
        <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
      </div>
      <div className="bg-gradient-to-br from-blue-30 to-indigo-100 p-5 rounded-lg">
        <h4 className="text-xl font-semibold mb-4 text-gray-700">
          Black Market Rates
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-green-600 font-medium">Buying:</span>
            <span className="font-bold text-2xl">{formatCurrency(buy)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-600 font-medium">Selling:</span>
            <span className="font-bold text-2xl">{formatCurrency(sell)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Spread:</span>
            <span className="font-bold">{calculateSpread(buy, sell)}%</span>
          </div>
        </div>
      </div>
      {officialRate && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Official Rate:{" "}
            <span className="font-semibold">
              {formatCurrency(officialRate)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BlackMarketRates;
