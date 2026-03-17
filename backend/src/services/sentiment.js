import Sentiment from 'sentiment'

const sentiment = new Sentiment()

export function analyzeSentiment(text) {
  if (!text) return 50
  
  const result = sentiment.analyze(text)
  
  let score = 50
  
  if (result.comparative > 0.5) {
    score = Math.min(100, 70 + (result.comparative * 20))
  } else if (result.comparative > 0) {
    score = 60 + (result.comparative * 20)
  } else if (result.comparative > -0.5) {
    score = 40 + (result.comparative * 20)
  } else {
    score = Math.max(0, 30 + (result.comparative * 20))
  }
  
  return Math.round(score)
}

export function getSentimentLabel(score) {
  if (score >= 70) return 'positivo'
  if (score >= 40) return 'neutral'
  return 'negativo'
}

export function isHotLead(lead) {
  return (
    lead.sentiment_score >= 70 ||
    lead.estado === 'nuevo' ||
    lead.servicio_interes === 'Psicología'
  )
}
