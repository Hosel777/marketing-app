-- Schema de Base de Datos para Supabase - CreSer Marketing

-- Tabla de Leads
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(50) NOT NULL,
  edad_paciente INTEGER,
  servicio_interes VARCHAR(100),
  fuente VARCHAR(50) DEFAULT 'web',
  mensaje TEXT,
  sentiment_score INTEGER DEFAULT 50,
  estado VARCHAR(50) DEFAULT 'nuevo',
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Contenido Programado
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  plataforma VARCHAR(50) NOT NULL,
  contenido TEXT,
  imagen_url TEXT,
  fecha_publicacion DATE,
  hora_publicacion TIME DEFAULT '10:00:00',
  estado VARCHAR(50) DEFAULT 'borrador',
  publicado_en TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Contenido Publicado (historial)
CREATE TABLE IF NOT EXISTS published_content (
  id SERIAL PRIMARY KEY,
  scheduled_post_id INTEGER REFERENCES scheduled_posts(id),
  titulo VARCHAR(255),
  tipo VARCHAR(50),
  plataforma VARCHAR(50),
  contenido TEXT,
  imagen_url TEXT,
  metricas JSONB,
  publicado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Citas
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  servicio VARCHAR(100),
  modalidad VARCHAR(50) DEFAULT 'presencial',
  estado VARCHAR(50) DEFAULT 'pendiente',
  observaciones TEXT,
  recordatorio_enviado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Servicios
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  icono VARCHAR(50),
  color VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Configuración
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar servicios por defecto
INSERT INTO services (nombre, descripcion, icono, color) VALUES
  ('Fonoaudiología', 'Evaluación y tratamiento de trastornos del lenguaje, habla y comunicación', '🗣️', '#FFF9C4'),
  ('Psicología', 'Acompañamiento terapéutico para niños, adolescentes, adultos y familias', '💚', '#C8E6C9'),
  ('Psicomotricidad', 'Desarrollo motor y coordinación a través del juego y movimiento', '🎯', '#F8BBD9'),
  ('Evaluación Neuropsicológica', 'Evaluación completa de funciones cognitivas y aprendizaje', '🧠', '#B3E5FC'),
  ('Inclusión Educativa', 'Apoyo para estudiantes con NEE en el ámbito escolar', '📚', '#E1BEE7'),
  ('Apoyo Escolar', 'Refuerzo académico y estrategias de estudio personalizadas', '✏️', '#C8E6C9')
ON CONFLICT DO NOTHING;

-- Insertar configuración inicial
INSERT INTO settings (clave, valor) VALUES
  ('institution_name', 'CreSer Equipo Interdisciplinario'),
  ('institution_email', 'equipocreser@equipocreser.com'),
  ('institution_phone', '351-876-3956'),
  ('institution_address', 'Niceto Vega 1844, Barrio Patricios Oeste, Córdoba'),
  ('whatsapp_enabled', 'true'),
  ('email_notifications_enabled', 'true')
ON CONFLICT DO NOTHING;

-- Habilitar Row Level Security (opcional)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (ajustar según necesidades)
CREATE POLICY "Permitir acceso público a leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Permitir insertar leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizar leads" ON leads FOR UPDATE USING (true);

-- Índices para mejor rendimiento
CREATE INDEX idx_leads_servicio ON leads(servicio_interes);
CREATE INDEX idx_leads_estado ON leads(estado);
CREATE INDEX idx_leads_fuente ON leads(fuente);
CREATE INDEX idx_leads_created ON leads(created_at);
CREATE INDEX idx_scheduled_fecha ON scheduled_posts(fecha_publicacion);
CREATE INDEX idx_appointments_fecha ON appointments(fecha);
