export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  // Video gratuito no está disponible actualmente
  // Se necesita crédito o servicio de pago
  return res.status(200).json({ 
    error: 'La generación de video gratuito no está disponible. Usa la imagen para crear tu post.',
    suggestion: 'Genera una imagen y úsala para Instagram/TikTok'
  })
}
