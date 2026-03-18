export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  // Video gratuito no está disponible en HuggingFace
  // Puedes usar la imagen generada para crear tu post en Instagram/TikTok
  return res.status(200).json({ 
    error: 'Video no disponible actualmente. Usa la imagen generada para tu post.',
    imageTip: 'Genera una imagen y úsala como foto de portada o crea un video con otra herramienta.'
  })
}
