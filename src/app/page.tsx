import { NextPage } from 'next'
import { getAllExchangeRates } from '@/libs'
import { BankExchangeRateResponse } from '@/types'

const Card: NextPage<{ rates: BankExchangeRateResponse }> = ({ rates }) => {
    const banks = rates.rates;
    return (
        <div>
            <h1>Exchange Rates</h1>
            <ul>
                {banks.map((rate, index) => (
                    <li key={index}>
                        <h2>{rate.currency_name}</h2>
                        <p>Bank: {rate.bank_name}</p>
                        <p>Buying Price: {rate.buying_price}</p>
                        <p>Selling Price: {rate.selling_price}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export async function Page() {
    const rates = await getAllExchangeRates();
    return <Card rates={rates.banks} />
}

export default Page