# Jarvis — Fase 2: Arquitectura (Entrega 1)

> Estado: **BORRADOR — pendiente de aprobación**
> Etiquetas: [S] seguro · [P] probable · [A] suposición a validar en Fase 3

## 1. Diagrama

```
 Xiaomi Redmi Note 13                         VPS Linux 24/7 (Ubuntu 24.04)
┌──────────────────────┐                 ┌──────────────────────────────────────┐
│ Google Reloj (alarma)│                 │ systemd: claude --channels telegram  │◄── chat
│   └─ al apagar ──►   │  HTTPS + token  │   (sesión Claude Code, plan Pro)     │
│ Tasker ─────────────────────────────►  │                                      │
│   └─ lee en voz alta │  GET /resumen   │ cron 06:25 L-V / 07:55 S-D:          │
│ Telegram ◄───────────────────────────  │   briefing.sh                        │
└──────────────────────┘   mensaje       │     ├─ Open-Meteo (clima)            │
 Notebook: Telegram Desktop (chat)       │     ├─ Google Calendar (3 cal.)      │
                                         │     ├─ claude -p (redacta resumen)   │
                                         │     ├─ guarda /srv/jarvis/resumen.txt│
                                         │     └─ Telegram sendMessage          │
                                         │ Caddy: HTTPS, sirve resumen.txt      │
                                         │ Repo jarvis: CLAUDE.md = memoria     │
                                         └──────────────────────────────────────┘
```

## 2. Decisiones

| # | Decisión | Alternativa descartada | Motivo |
|---|---|---|---|
| D1 | **VPS** (Hetzner CX22 o DigitalOcean básico, ~USD 5–7/mes) [P] | Notebook propia | Se apaga; cortes de luz |
| D2 | **Claude Code Channels + plugin oficial Telegram** [S] | Bot propio + API Claude | Menos código; usa el plan Pro; responde "Claude", no un bot genérico |
| D3 | Resumen matinal por **cron + `claude -p`**, independiente de la sesión de chat | Pedírselo a la sesión de Channels | Si la sesión de chat se cae, el resumen sale igual (RNF-03) |
| D4 | Envío del resumen con **Telegram `sendMessage`** directo | Vía el plugin | No interfiere con el polling del plugin [S] |
| D5 | Calendar vía **cuenta de servicio de Google**, con los 3 calendarios compartidos a su email [S] | OAuth con refresh token en el VPS | Sin vencimientos de token ni login interactivo en servidor |
| D6 | Permiso de la cuenta de servicio: **solo lectura** en Entrega 1; "hacer cambios" en Entrega 2 | Escritura desde el día 1 | Mínimo privilegio |
| D7 | Alarma con **Google Reloj** + Tasker evento "Alarm Done" [P] | Reloj nativo Xiaomi | El reloj Xiaomi no expone el evento de forma confiable a Tasker [A] |
| D8 | Tasker obtiene el texto por **GET HTTPS con token** y usa *Say* (TTS) | Leer la notificación de Telegram | Más robusto, no depende de permisos de notificación de HyperOS |
| D9 | **Caddy** como servidor HTTPS (certificado automático) | Nginx + certbot | Menos configuración |
| D10 | Memoria = **`CLAUDE.md` + archivos del repo `jarvis`** | Base de datos | Suficiente para Entrega 1; base de datos llega en Entrega 3 (AESA) |
| D11 | Proceso de Channels bajo **systemd + tmux**, reinicio automático | Terminal abierta a mano | Sobrevive reinicios del VPS |
| D12 | Permisos de Claude Code: **lista blanca explícita** en `settings.json` (leer archivos del repo, ejecutar `briefing.sh`, curl a Open-Meteo/Calendar) | `--dangerously-skip-permissions` | La sesión está expuesta a mensajes entrantes: no debe poder ejecutar cualquier cosa |

## 3. Seguridad

- Telegram: lista blanca por ID de usuario (`/telegram:access`), solo Carlos. [S]
- Secretos en `/etc/jarvis/env` (permisos 600): token del bot, JSON de la cuenta de servicio, token del endpoint. Nunca en git. [S]
- VPS: login SSH solo con clave, firewall (22, 80, 443), actualizaciones automáticas. [S]
- Endpoint `/resumen`: token largo en header; solo devuelve el texto del día. [S]

## 4. Modelo de datos mínimo (Entrega 1)

| Elemento | Formato | Ubicación |
|---|---|---|
| Perfil y reglas de asesor | Markdown | `jarvis/CLAUDE.md` |
| Calendarios | IDs de Google Calendar: `personal`, `aesa`, `modulos` | `jarvis/config.yaml` |
| Horarios | `lun-vie 06:30`, `sab-dom 08:00`, TZ `America/Argentina/Buenos_Aires` | `jarvis/config.yaml` |
| Ubicación clima | lat -34.61, lon -58.38 | `jarvis/config.yaml` |
| Último resumen | Texto plano | `/srv/jarvis/resumen.txt` |

## 5. Riesgos

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Channels es *research preview* y cambia | Media | Alto | Resumen matinal no depende de Channels (D3) |
| Límite de uso del plan Pro | Baja–Media | Medio | Resumen usa 1 llamada/día; vigilar consumo; Max si hace falta |
| HyperOS mata Tasker/Telegram | Alta | Alto | Autoinicio + batería sin restricción (RNF-07); prueba de 14 días en Fase 4 |
| Google Calendar falla | Baja | Medio | Resumen sale solo con clima + aviso (RNF-03) |
| Sesión de Claude Code expira el login | Media [A] | Alto | systemd la reinicia; alerta por Telegram si `briefing.sh` detecta error de auth |

## 6. Cuentas y accesos que necesita crear el usuario (antes de Fase 3)

1. **VPS**: cuenta en Hetzner o DigitalOcean; crear servidor Ubuntu 24.04, 2 GB RAM.
2. **Dominio o subdominio** (opcional, ~USD 10/año) para HTTPS limpio. Sin dominio se puede usar `sslip.io` con la IP. [P]
3. **Bot de Telegram** con @BotFather → guardar el token (no pegarlo en chats).
4. **Google Cloud**: proyecto nuevo, habilitar Calendar API, crear cuenta de servicio, descargar su JSON.
5. **Google Calendar**: crear los 3 calendarios y compartirlos con el email de la cuenta de servicio ("ver todos los detalles").
6. **Xiaomi**: instalar Google Reloj, Tasker (pago único ~USD 3,5) y Telegram; aplicar RNF-07.

## 7. Criterio de salida de la Fase 2

- [ ] Arquitectura aprobada.
- [ ] Proveedor de VPS elegido.
- [ ] Ítems 1, 3, 4, 5 y 6 de la sección 6 hechos.
