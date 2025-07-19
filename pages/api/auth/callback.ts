import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple redirect for email confirmations and OAuth flows
  // The auth state will be handled by the client-side SessionContextProvider
  res.redirect('/')
} 