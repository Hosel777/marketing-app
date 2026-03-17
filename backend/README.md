# CreSer Backend - API de Marketing

## Estructura

```
backend/
├── src/
│   ├── index.js           # Servidor Express principal
│   ├── routes/
│   │   ├── leads.js       # API de gestión de leads
│   │   ├── content.js     # API de contenido
│   │   ├── whatsapp.js    # API de WhatsApp
│   │   ├── ai.js          # API de IA (Nano Banana 2)
│   │   └── analytics.js   # API de analytics
│   └── services/
│       ├── supabase.js    # Cliente Supabase
│       ├── whatsapp.js    # Servicio de WhatsApp
│       ├── ai.js          # Servicio de IA
│       └── sentiment.js   # Análisis de sentimiento
├── .env.example           # Variables de entorno
├── schema.sql            # Schema de base de datos
└── n8n-workflow-*.json   # Workflows de automatización
```

##安装

```bash
cd backend
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Completar las variables en `.env`:
- `SUPABASE_URL` - URL de tu proyecto Supabase
- `SUPABASE_ANON_KEY` - Clave pública de Supabase
- `WHATSAPP_ACCESS_TOKEN` - Token de WhatsApp Business API
- `GEMINI_API_KEY` - Clave de Google Gemini API

3. Ejecutar el schema en Supabase:
- Ir a SQL Editor en Supabase
- Ejecutar el contenido de `schema.sql`

## Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/leads` | Crear nuevo lead |
| GET | `/api/leads` | Listar leads (con filtros) |
| GET | `/api/leads/:id` | Obtener lead específico |
| PUT | `/api/leads/:id` | Actualizar lead |
| DELETE | `/api/leads/:id` | Eliminar lead |
| POST | `/api/content/generate` | Generar contenido con IA |
| POST | `/api/content/generate-image` | Generar imagen con IA |
| POST | `/api/content/schedule` | Programar contenido |
| GET | `/api/content/scheduled` | Ver contenido programado |
| POST | `/api/whatsapp/send` | Enviar mensaje WhatsApp |
| POST | `/api/whatsapp/webhook` | Webhook de WhatsApp |
| GET | `/api/analytics/overview` | Métricas generales |
| GET | `/api/analytics/leads-by-service` | Leads por servicio |
| GET | `/api/analytics/leads-by-fuente` | Leads por fuente |
| GET | `/api/health` | Estado del servidor |

## Deploy

### Railway/Render
```bash
# Crear proyecto
railway init

# Deploy
railway up
```

### Variables de entorno en producción
Asegurate de configurar todas las variables en el dashboard de Railway/Render.

## Integraciones

### Supabase
- Base de datos de leads
- Contenido programado
- Citas

### WhatsApp Business
- Mensajes de bienvenida automáticos
- Recordatorios 24h antes de citas
- Chatbot de captación

### Nano Banana 2 (Gemini)
- Generación de copy para redes
- Generación de imágenes
- Análisis de sentimiento

### n8n
- Automatización de workflows
- Notificaciones
- Sincronización de datos
