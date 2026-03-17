import express from 'express'
import { 
  sendWhatsAppMessage, 
  sendWelcomeMessage, 
  sendReminderMessage, 
  sendLeadMagnets,
  handleIncomingMessage 
} from '../services/whatsapp.js'

const router = express.Router()

router.post('/send', async (req, res) => {
  try {
    const { to, message, template } = req.body
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Teléfono y mensaje son requeridos' })
    }

    const result = await sendWhatsAppMessage(to, message, template)
    
    res.json({
      success: result.success,
      data: result.data || null,
      mock: result.mock || false
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al enviar mensaje' })
  }
})

router.post('/webhook', async (req, res) => {
  try {
    const { entry } = req.body
    
    if (!entry || !entry[0]?.changes) {
      return res.json({ received: true })
    }

    const changes = entry[0].changes
    
    for (const change of changes) {
      if (change.value?.messages) {
        for (const message of change.value.messages) {
          if (message.type === 'text') {
            const from = message.from
            const text = message.text.body
            
            console.log('Received message from:', from, 'Text:', text)
            
            await handleIncomingMessage(from, text)
          }
        }
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Error en webhook' })
  }
})

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']
  
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'creser_verify_token_2024'
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified')
    res.status(200).send(challenge)
  } else {
    res.status(403).send('Verification failed')
  }
})

router.post('/lead/welcome', async (req, res) => {
  try {
    const lead = req.body
    
    const result = await sendWelcomeMessage(lead)
    
    res.json({
      success: result.success,
      message: 'Mensaje de bienvenida enviado'
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al enviar mensaje' })
  }
})

router.post('/lead/reminder', async (req, res) => {
  try {
    const { lead, fecha, hora } = req.body
    
    const result = await sendReminderMessage(lead, fecha, hora)
    
    res.json({
      success: result.success,
      message: 'Recordatorio enviado'
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al enviar recordatorio' })
  }
})

router.post('/lead/magnet', async (req, res) => {
  try {
    const { lead, servicio } = req.body
    
    const result = await sendLeadMagnets(lead, servicio)
    
    res.json({
      success: result.success,
      message: 'Lead magnet enviado'
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Error al enviar lead magnet' })
  }
})

export default router
