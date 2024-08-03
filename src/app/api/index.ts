import { NextApiRequest, NextApiResponse } from 'next';

const handler = async(req:NextApiRequest, res:NextApiResponse) => {
    // only handle GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }


    return res.status(200).json({ 
        message: 'Hello from the API',
        data: []
     });

}

export default handler;