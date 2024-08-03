import React from "react";

const BlackMarketRates = ({ currencyData }: any) => {
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
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
        <p className="text-lg font-semibold mb-2">Black Market Rates</p>
        <div className="flex items-center">
          <span className="text-green-600 mr-4">Buying:</span>
          <span className="font-bold text-xl">{currencyData?.buy}</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-red-600 mr-4">Selling:</span>
          <span className="font-bold text-xl">{currencyData?.sell}</span>
        </div>
      </div>
    </div>
  );
};

export default BlackMarketRates;
