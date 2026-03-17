import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import leadsRouter from './routes/leads.js'
import contentRouter from './routes/content.js'
import whatsappRouter from './routes/whatsapp.js'
import aiRouter from './routes/ai.js'
import analyticsRouter from './routes/analytics.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))

app.use(express.json())

app.use('/api/leads', leadsRouter)
app.use('/api/content', contentRouter)
app.use('/api/whatsapp', whatsappRouter)
app.use('/api/ai', aiRouter)
app.use('/api/analytics', analyticsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`🚀 CreSer Backend running on port ${PORT}`)
})
