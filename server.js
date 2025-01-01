import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.EXPRESS_PORT || 5001

app.use(cors())

app.get('/api/market', async (req, res) => {
  try {
    const response = await fetch('https://user26614.requestly.tech/test/api/market')
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ error: 'Failed to fetch data' })
  }
})

app.get('/api/currencies', async (req, res) => {
  try {
    const response = await fetch('https://user26614.requestly.tech/test/api/currency')
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).json({ error: 'Failed to fetch data' })
  }
})

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`)
});
