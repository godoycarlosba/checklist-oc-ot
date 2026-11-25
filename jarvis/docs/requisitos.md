# Jarvis — Fase 1: Requisitos (Entrega 1)

> Estado: **BORRADOR — pendiente de aprobación del usuario**
> Alcance de la Entrega 1: despertador + clima + agenda diaria.
> Nota: carpeta temporal dentro de `checklist-oc-ot`. Migrar a repo propio `jarvis` antes de la Entrega 3.

## 1. Contexto del usuario

| Dato | Valor | Estado |
|---|---|---|
| Celular | Xiaomi Redmi Note 13 (Android / HyperOS) | Confirmado |
| Ciudad | Buenos Aires (lat -34.61, lon -58.38) | Confirmado |
| Zona horaria | America/Argentina/Buenos_Aires (UTC-3, sin horario de verano) | Confirmado |
| Despertar lunes a viernes | 06:30 | Confirmado |
| Despertar fin de semana | **A definir** (se asume 06:30) | Pendiente |
| Agenda | Google Calendar | Confirmado |
| Notebook | Sí, pero se apaga → **no sirve como host** | Confirmado |
| Reloj / tablet | **A definir** | Pendiente |
| Plan Claude | Pro (incluye Claude Code) | Confirmado |
| Host 24/7 | VPS Linux (~USD 5–6/mes) | Propuesto |
| Canal de chat | Telegram vía **Claude Code Channels** (plugin oficial) | Propuesto |

## 2. Requisitos funcionales

| ID | Requisito | Prioridad |
|---|---|---|
| RF-01 | A las 06:30 suena una alarma en el Android. Al apagarla, el celular lee en voz alta el resumen del día. | Alta |
| RF-02 | El resumen incluye la temperatura actual, la sensación térmica, la mínima y la máxima, y la probabilidad de lluvia con hora pico. | Alta |
| RF-03 | El resumen incluye la agenda del día separada por frente: **Personal / AESA / Módulos**. | Alta |
| RF-04 | El mismo resumen llega por Telegram a las 06:25, para que esté listo cuando suena la alarma. | Alta |
| RF-05 | Desde Telegram se puede preguntar "¿qué tengo hoy/mañana/el jueves?", con filtro opcional por frente. | Media |
| RF-06 | Aviso por Telegram 30 minutos antes de cada evento. | Media |
| RF-07 | Si hay más de 60 % de probabilidad de lluvia, el resumen lo destaca ("llevá paraguas / revisar tareas a la intemperie en obra"). | Baja |

## 3. Requisitos no funcionales

| ID | Requisito |
|---|---|
| RNF-01 | El cerebro corre en la nube 24/7 y no depende de que una PC esté encendida. |
| RNF-02 | Disponible en Android, PC (Telegram Desktop/Web) y reloj (notificaciones de Telegram). |
| RNF-03 | Si falla el clima o el Calendar, el resumen se envía igual con la parte que sí funcionó, y avisa qué falló. |
| RNF-04 | Credenciales (Google, Telegram, Claude) guardadas solo como secretos del servidor, nunca en el repo. |
| RNF-05 | Costo mensual objetivo: VPS (~USD 6) + plan Pro existente. Sin API paga aparte. |
| RNF-07 | Xiaomi/HyperOS: Telegram y Tasker con **autoinicio activado** y **sin restricción de batería**, si no el sistema los mata. |
| RNF-08 | Contexto persistente en `CLAUDE.md` (reglas de asesor, 3 frentes, AESA, Módulos), porque la sesión no guarda memoria entre reinicios. |
| RNF-06 | Solo el usuario puede hablar con el bot (lista blanca por ID de Telegram). |

## 4. Fuentes de datos

| Fuente | Uso | Costo | Verificado |
|---|---|---|---|
| Open-Meteo | Clima actual y pronóstico diario/horario | Gratis, sin clave | Sí (probado 2026-11-25) |
| Google Calendar API | Leer eventos de 3 calendarios | Gratis | Pendiente OAuth |
| Telegram Bot API | Canal de chat y notificaciones | Gratis | Pendiente crear bot |
| Claude Code (plan Pro) + Channels | Interacción por Telegram y resumen diario | Incluido en Pro (con límites de uso) | Pendiente configurar |

## 5. Acción previa del usuario (bloqueante para la Fase 3)

1. En Google Calendar, crear 3 calendarios: **Personal**, **AESA** y **Módulos**, y mover los eventos existentes al que corresponda.
2. Instalar Telegram en el Android y en la PC.
3. Instalar **Tasker** en el Xiaomi para el RF-01, y en Ajustes → Apps darle a Telegram y Tasker *Autoinicio* y *Ahorro de batería: Sin restricciones*.
4. Contratar un VPS (o aprobar que lo elijamos en la Fase 2).

## 6. Ejemplo de resumen (a aprobar)

> Buen día Carlos. Son las 6:30 en Buenos Aires: 18°, sensación 17°. Hoy máxima 30°, mínima 18°, sin lluvia.
> **AESA:** 09:30 reunión de seguimiento OC; 15:00 revisión PIE.
> **Módulos:** 11:00 llamada con el proveedor de perfilería.
> **Personal:** 19:00 gimnasio.
> Primer compromiso en 3 horas.

## 7. Criterio de salida de la Fase 1

- [ ] Datos pendientes completados (fin de semana, otros dispositivos).
- [ ] Formato del resumen (sección 6) aprobado o corregido.
- [ ] Acciones previas de la sección 5 hechas o agendadas.
