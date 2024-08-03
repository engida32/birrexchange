import React from "react";
interface Rate {
  bank: string;
  icon: string;
  buy: number;
  sell: number;
}

const OfficialRates = ({ currencyData }: any) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <img
          src={currencyData?.flag}
          alt={`${currencyData?.name} flag`}
          className="w-8 h-8 mr-2"
        />
        <h3 className="text-xl font-bold">{currencyData?.name}</h3>
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
          {currencyData?.rates?.map((rate: Rate, rateIndex: number) => (
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
  );
};

export default OfficialRates;
