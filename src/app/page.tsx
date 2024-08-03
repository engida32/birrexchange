import ExchangeRates from "@/components/ExchangeRate";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ExchangeRates />
    </div>
  );
}
