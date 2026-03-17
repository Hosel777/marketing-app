import axios from 'axios'

const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0'

const getConfig = () => ({
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN
})

export async function sendWhatsAppMessage(to, message, template = false) {
  const config = getConfig()
  
  if (!config.accessToken) {
    console.log('WhatsApp not configured - would send:', { to, message: message.substring(0, 50) })
    return { success: true, mock: true }
  }

  try {
    const body = template ? {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: message,
        language: { code: 'es_AR' }
      }
    } : {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    }

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${config.phoneNumberId}/messages`,
      body,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error sending WhatsApp:', error.response?.data || error.message)
    return { success: false, error: error.message }
  }
}

export async function sendWelcomeMessage(lead) {
  const message = `¡Hola ${lead.nombre}! 👋

Gracias por contactar a CreSer - Equipo Interdisciplinario.

Recibimos tu solicitud de información sobre ${lead.servicio_interes}. 

Un miembro de nuestro equipo te contactará en las próximas 24 horas para brindarte más información y ayudarte a programar una evaluación.

💬 ¿Prefieres escribirnos directamente aquí? https://wa.me/5493518763956

¡Te esperamos! 🐦`

  return sendWhatsAppMessage(lead.telefono.replace(/[^0-9]/g, ''), message)
}

export async function sendReminderMessage(lead, fecha, hora) {
  const message = `¡Hola ${lead.nombre}! 📅

Te recordamos que tienes una cita programada con CreSer:

📅 Fecha: ${fecha}
🕐 Hora: ${hora}
📍 Niceto Vega 1844, Córdoba

¿Necesitas reprogramar? Contáctanos con anticipación.

¡Nos vemos pronto! 🐦`

  return sendWhatsAppMessage(lead.telefono.replace(/[^0-9]/g, ''), message)
}

export async function sendLeadMagnets(lead, servicio) {
  const leadMagnets = {
    'fonoaudiologia': 'Estimulación del lenguaje 0-5 años',
    'psicologia': 'Kit emocional para familias',
    'psicomotricidad': 'Juegos sensoriales caseros',
    'inclusion': 'Derechos de estudiantes con NEE',
    'apoyo': 'Planner de organización escolar'
  }

  const resource = leadMagnets[servicio] || 'recurso especial'

  const message = `¡Hola ${lead.nombre}! 📥

Gracias por tu interés en ${lead.servicio_interes}.

Hemos enviado a tu email el ${resource}. Revisa tu bandeja de entrada (y spam).

¿Tienes preguntas? Estamos aquí para ayudarte.

Equipo CreSer 🐦`

  return sendWhatsAppMessage(lead.telefono.replace(/[^0-9]/g, ''), message)
}

export async function handleIncomingMessage(from, messageBody) {
  const welcomeMsg = `¡Hola! 👋

Gracias por escribir a CreSer - Equipo Interdisciplinario.

¿En qué podemos ayudarte hoy?

1️⃣ Información sobre servicios
2️⃣ Agendar una evaluación
3️⃣ Hablar con un profesional
4️⃣ Otra consulta

Responde con el número de tu opción.`

  return sendWhatsAppMessage(from, welcomeMsg)
}
