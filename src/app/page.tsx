import { NextPage } from 'next'
// import { getAllExchangeRates } from '@/libs'
// import { ExchangeRateResponse } from '@/types'

const Card: NextPage = () => {
    return (
        <div>
            <h1>Exchange Rates</h1>
        </div>
    )
}

export async function Page() {
    // Example of fetching data from the server
    // const rates = await getAllExchangeRates();
    return <Card />
}

export default Page