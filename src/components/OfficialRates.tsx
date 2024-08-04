import Image from "next/image";
import React from "react";

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
}

const OfficialRates: React.FC<{ currencyData: CurrencyData }> = ({
  currencyData,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-br from-blue-30 to-indigo-100 p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center mb-6 bg-white p-4 rounded-lg shadow">
        <img
          src={currencyData.flag}
          alt={`${currencyData.name} flag`}
          className="rounded-full mr-4"
          width={60}
          height={60}
        />
        <h2 className="text-xl font-bold text-indigo-800">
          {currencyData.name} Official Rates
        </h2>
      </div>

      <div className="overflow-x-auto max-h-100">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Bank
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Buying
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Selling
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currencyData.rates.map((rate: Rate, rateIndex: number) => (
              <tr
                key={rateIndex}
                className="hover:bg-indigo-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <img
                        src={rate.icon}
                        alt={`${rate.bank} icon`}
                        // layout="fill"
                        //objectFit="contain"
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-4 font-medium text-gray-900">
                      {rate.bank}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {formatCurrency(rate.buy)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-red-600">
                    {formatCurrency(rate.sell)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfficialRates;
