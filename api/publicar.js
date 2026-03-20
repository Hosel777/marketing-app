export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL
  if (!N8N_WEBHOOK_URL) {
    return res.status(500).json({ error: 'Configuración de n8n no encontrada' })
  }

  const { content, type, platform, service, imageUrl } = req.body || {}

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'publicar',
        copy: content.copy,
        hashtags: content.hashtags,
        imageUrl: imageUrl,
        tipo: type,
        plataforma: platform,
        servicio: service,
        modulo: 'Marketing CreSer'
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n responded with ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json({ success: true, message: 'Publicación enviada a n8n', data })
  } catch (error) {
    console.error('Error in publicacion api:', error)
    return res.status(500).json({ error: 'Error al enviar a n8n', details: error.message })
  }
}
