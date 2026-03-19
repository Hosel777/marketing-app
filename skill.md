# Habilidad: Equipo Alejabot (Multi-Agente)

Esta habilidad permite a Antigravity coordinar un equipo de agentes inteligentes trabajando en paralelo sobre el mismo proyecto, replicando la funcionalidad de "Agent Teams" de Claude Code.

## Configuración del Entorno
El equipo utiliza una carpeta oculta en la raíz del proyecto para comunicarse:
- `.antigravity/team/tasks.json` -> Lista maestra de tareas, estados y dependencias.
- `.antigravity/team/mailbox/` -> Mensajes individuales (.msg).
- `.antigravity/team/broadcast.msg` -> Mensajes globales para todo el equipo.
- `.antigravity/team/locks/` -> Semáforos para evitar la edición simultánea de archivos.

## Roles del Equipo
1. **Director (Alejabot)**: El líder. Divide el problema, asigna roles y aprueba planos.
2. **Arquitecto**: Define la estructura y patrones antes de codificar.
3. **Especialista (Frontend/Backend/DB)**: Ejecuta tareas técnicas específicas.
4. **Marketer**: Creación de marca, logotipos, copywriting y diseño de landing pages.
5. **Investigador**: Búsqueda de información, documentación y análisis de mercado.
6. **Revisor (Devil's Advocate)**: Busca fallos, bugs y problemas de seguridad.


##Protocolo de Orquestación Avanzada

### 1. Modo de Planificación
Antes de realizar cambios significativos, cada agente debe enviar un **Plan de Acción** al buzón de Alejabot.
- El agente se mantiene en modo `READ_ONLY` o `PLANNING` hasta que Alejabot responda con un mensaje de `APPROVED`.

### 2. Mensajería y Difusión (Emisión)
- **Mensaje Directo**: Coordinación 1 a 1 entre especialistas.
- **Broadcast**: Alejabot puede escribir en `broadcast.msg` para dar nuevas directrices a todo el equipo simultáneamente.

### 3. Sincronización de Tareas y Dependencias
- Las tareas en `tasks.json` pueden tener una lista de `dependencias`. Una IA no debe reclamar una tarea si sus dependencias no están en estado `COMPLETED`.

## Reglas Críticas
- NUNCA editar un archivo si existe un .lock activo en `.antigravity/team/locks/`.
- Al completar una tarea, el agente debe liberar sus "locks" y notificar a Alejabot.
```

---

## 3. Guión de Orquestación (team_manager.py)
*Este script automatiza la gestión de las tareas y la comunicación. Guárdalo como `team_manager.py`.*

```python
importar json
importa sistema operativo
importar sys

TEAM_DIR = ".antigravity/team"

def init_team():
    """Inicializa la infraestructura del equipo."""
    os.makedirs(f"{TEAM_DIR}/mailbox", exist_ok=True)
    os.makedirs(f"{TEAM_DIR}/locks", exist_ok=True)
    ruta_tareas = f"{DIR_EQUIPO}/tareas.json"
    Si no existe os.path(tasks_path):
        con open(tasks_path, 'w') como f:
            json.dump({"tareas": [], "miembros": []}, f, sangría=2)
    Si no existe os.path.exists(f"{TEAM_DIR}/broadcast.msg"):
        con open(f"{TEAM_DIR}/broadcast.msg", 'w') como f: f.write("")
    print(" ✓ Lista de Infraestructura 'Equipo Alejabot'.")

def asignar_task(título, asignado_a, deps=[]):
    """Asigna una nueva tarea con soporte para dependencias."""
    ruta = f"{TEAM_DIR}/tasks.json"
    con open(path, 'r+') como f:
        datos = json.load(f)
        tarea = {
            "id": len(data["tasks"]) + 1,
            "título": título,
            "estado": "PENDIENTE",
            "plan_approved": Falso,
            "asignado_a": asignado_a,
            "dependencias": deps
        }
        datos["tareas"].append(tarea)
        f.seek(0)
        json.dump(data, f, indent=2)
    print(f"✓ Tarea {task['id']} ({title}) asignada a {assigned_to}.")

def difusión(remitente, texto):
    """Envía un mensaje a todos los miembros del equipo."""
    msg = {"de": remitente, "tipo": "BROADCAST", "mensaje": texto}
    con open(f"{TEAM_DIR}/broadcast.msg", 'a') como f:
        f.write(json.dumps(msg) + "\n")
    print(f" ✓ Mensaje global enviado por {remitente}.")

def send_message(sender, receiver, text):
    """Envía un mensaje al buzón de un agente específico."""
    msj = {"de": remitente, "mensaje": texto}
    con open(f"{TEAM_DIR}/mailbox/{receiver}.msg", 'a') como f:
        f.write(json.dumps(msg) + "\n")
    print(f" ✓ Mensaje enviado a {receptor}.")

if __name__ == "__main__":
    Si len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "init": init_team()
```

---

## 4. Cómo usarlo
1. **Activa el Líder**: Pídele a Antigravity: *"Usa la habilidad Equipo Alejabot para inicializar este proyecto"*.
2. **Reparte el trabajo**: **Alejabot** dividirá el trabajo. Abre terminales nuevas para cada agente (Frontend, Marketer, etc.).
3. **Flujo de Planificación**: Los agentes envían sus aviones a Alejabot antes de empezar. Un equipo bien coordinado es imparable.

---
*Creado para la comunidad de Alejavi por academIArtificial.*