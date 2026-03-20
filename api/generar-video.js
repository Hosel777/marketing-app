export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, service } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
  if (!N8N_WEBHOOK_URL) {
    return res.status(200).json({ 
      error: 'Configuración de n8n no encontrada.',
      imageTip: 'Utiliza la imagen generada por ahora.' 
    })
  }

  try {
    // Iniciamos el proceso en n8n (Kling AI)
    // No esperamos la respuesta de n8n ya que Kling tarda minutos
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generar-video',
        promptVisual: prompt,
        servicio: service,
        tipo: 'video'
      })
    }).catch(err => console.error('Error enviando a n8n:', err))

    return res.status(200).json({ 
      success: true,
      message: 'Procesando Video con Kling AI ✨',
      info: 'El video se está generando en segundo plano. Recibirás una notificación por WhatsApp cuando esté listo.'
    })
  } catch (error) {
    return res.status(500).json({ error: 'Error al iniciar proceso de video' })
  }
}
