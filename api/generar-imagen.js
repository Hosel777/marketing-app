import axios from 'axios'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body || {}

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt es requerido' })
  }

  try {
    // Usamos Puter AI (vía su API REST) por ser extremadamente estable y gratuito
    // El modelo 'flux' de Puter es superior en realismo
    const response = await axios.post('https://api.puter.ai/v1/ai/txt2img', {
      prompt: `${prompt}, professional photography, soft lighting, warm therapeutic atmosphere, high resolution`,
      model: 'flux',
      width: 1024,
      height: 1024
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer' // Recibimos la imagen directamente
    })

    const base64Image = Buffer.from(response.data, 'binary').toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`

    return res.status(200).json({ success: true, imageUrl })

  } catch (error) {
    console.error('Puter AI error:', error.message)
    
    // Fallback a Pollinations si Puter falla (para que nunca te quedes sin imagen)
    const seed = Math.floor(Math.random() * 100000)
    const fallbackUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true&seed=${seed}`
    
    return res.status(200).json({ 
      success: true, 
      imageUrl: fallbackUrl,
      source: 'fallback' 
    })
  }
}
