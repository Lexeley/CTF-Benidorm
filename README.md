# CTF educativo: los dispositivos de Laura

Web 100 % estática (sin backend, sin base de datos, sin cookies, sin analytics, sin llamadas a terceros) para un taller de ciberseguridad de 45 minutos con alumnado de 16-17 años. Laura (17 años), su familia, sus amigos y su instituto son ficticios. Aparecen marcas reales (Instagram, BBVA, Correos, DGT, Brawl Stars…) solo como ejemplo educativo, sin logos: todos los mensajes, fichas y capturas son simulados y ningún enlace es clicable. Los dominios fraudulentos son inventados.

| Ruta | Qué es |
|---|---|
| `/` | Portada con selector de modo |
| `/escritorio/` | «El portátil de Laura»: 7 retos (hashes, OSINT, phishing, metadatos, cifrado, paquetes, auditoría) |
| `/movil/` | «El móvil de Laura»: 7 retos (permisos, tienda falsa, smishing, wifi gemela, robo, ubicación, rastreador) |
| `/profe/` | Marcador: pegar/escanear códigos de equipo y ranking proyectable |

Cada modo incluye la pestaña **Kit** con todas las herramientas (Base64/Hex/URL/invertir, César/ROT, Vigenère, hashes MD5/SHA-1/SHA-256, buscador de hash con sal opcional contra una wordlist de 5.000 contraseñas, visor EXIF con mapa esquemático y tabla de coordenadas de lugares conocidos, inspector de URL y visor de paquetes).

El nivel es alto a propósito (retos encadenados, señuelos, deducción): en 35 minutos lo normal es que ningún equipo lo resuelva todo. Si quieres bajarlo, sube `GAME_SECONDS` o abarata las pistas (`HINT_COST`). Funciona sin internet una vez cargada la página: los trozos pesados se precargan en segundo plano.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # Vitest: verificación de respuestas, código de equipo y Kit
npm run build      # tsc + vite build → dist/
npm run preview    # sirve dist/
```

Requisitos: Node 22.6+ (los scripts importan módulos `.ts` directamente; probado con Node 24).

## Respuestas y soluciones (importante si el repo es público)

- En el bundle **solo** hay, por reto, `{ mode, salt, hashes }` en `src/generated/answers.json`: SHA-256 de `sal + ":" + respuesta normalizada`. La verificación se hace con Web Crypto.
- Normalización (`src/core/normalize.ts`): minúsculas, sin tildes, espacios colapsados. Con `mode: "compact"` además se quitan separadores (`A, C, E` = `ace`, `DE:AD:…` = `dead…`).
- Las respuestas en claro y los parámetros secretos están en **`solutions/answers.local.json`** y la explicación de cada reto en **`solutions/SOLUCIONES.md`**. La carpeta `solutions/` está en `.gitignore`: no se sube al repo ni entra en el build. **Guarda una copia fuera del repo.**
- Plantilla para quien clone el repo: `scripts/answers.example.json`.
- `npm run check` comprueba que cada respuesta valida contra `answers.json`, que una respuesta basura no valida y que en `dist/` no aparece ninguna respuesta en claro ni ficheros de soluciones.

Limitación asumida: en los retos con pocas opciones (elegir letras, ordenar 6 pasos) alguien con la consola del navegador podría probar combinaciones por fuerza bruta. La interfaz aplica un enfriamiento creciente tras cada fallo (5 s, 10 s… hasta 30 s), que basta para el aula. Además, algunos datos son necesariamente visibles porque son el propio reto (la contraseña está dentro de la captura de red; las coordenadas, dentro de la foto).

## Regenerar assets (hashes, fotos, captura, wordlist)

Todo sale de scripts reproducibles en `scripts/`:

| Script | Genera |
|---|---|
| `wordlist.mjs` | `src/generated/wordlist.txt`: 5.000 contraseñas débiles por combinación (no usa filtraciones reales) |
| `puzzles.mjs` | `puzzles.json`: `claves.bak` del reto e1 (SHA-256 con sal; comprueba que las débiles están en la wordlist y la frase larga no) y el texto cifrado del e5 (Vigenère → invertir → hex → Base64) |
| `packets.mjs` | `packets.json`: captura simulada con PRNG de semilla fija, IPs de documentación (RFC 5737), señuelos y dos peticiones con HTTP Basic Auth (una fallida) |
| `photos.mjs` | `foto-portatil.jpg` y `foto-movil.jpg`: dibujo procedural + EXIF (cámara inventada, fecha, GPS) |
| `answers.mjs` | `answers.json`: sales nuevas y hashes de las respuestas aceptadas |

```bash
npm run gen      # todo lo anterior
npm run answers  # solo los hashes de respuestas (tras cambiar una respuesta)
npm run check    # verificación cruzada (ejecútalo después de npm run build)
```

Los ficheros generados **sí** se suben al repo, así que el build funciona sin `solutions/`.

## Personalizar retos

Cada reto es un fichero de datos tipado (`Challenge` en `src/core/types.ts`):

```
src/challenges/escritorio/e1-hashes.ts … e7-auditoria.ts
src/challenges/movil/m1-permisos.ts … m7-rastreador.ts
src/challenges/widgets.ts   ← piezas comunes: marcar letras, clasificar F/L, ordenar con ↑↓
src/ui/sim.ts               ← marcos realistas: ventanas, pantallas de móvil, enlaces con «copiar / analizar en el kit»
```

Campos: `id` (clave en `answers.json`), `title`, `category` (etiqueta tipo CTF), `story`, `difficulty` (`facil` 100 / `medio` 200 / `dificil` 300), `hints` (2; cada una resta el 25 % del valor), `answerHelp`, `attachments`, `render` (parte interactiva; `ctx.fill()` vuelca una selección al campo de respuesta), `lesson` (se muestra al resolver) y `tip` (alimenta los «3 ajustes que haría hoy mismo» del resumen final).

Para cambiar una respuesta: edita el reto, actualiza `solutions/answers.local.json` (y `params` si afecta a un asset), y ejecuta `npm run gen` (o `npm run answers`) y luego `npm run check`. Para añadir un reto: crea el fichero, añádelo al `index.ts` del modo y añade su `id` a `answers.local.json`.

Otros ajustes: duración del juego y coste de las pistas en `src/core/state.ts` (`GAME_SECONDS`, `HINT_COST`).

## Marcador y su limitación

No hay servidor. Cada equipo tiene un **código de equipo** (pestaña «Equipo»): `LU1.` + base64url de `{nombre, modo, puntos, retos resueltos con pistas y segundos, pistas totales}` + checksum. Se puede copiar o mostrar como QR. En `/profe/` se pegan (varios a la vez) o se escanean con la cámara (`BarcodeDetector` nativo o `jsQR` como alternativa; la cámara exige https o localhost). El ranking ordena por puntos y, a igualdad, por quién resolvió antes su último reto. Se guarda solo en el navegador del profe.

**Es un sistema de honor**: el checksum detecta errores al copiar, no trampas. Un alumno con conocimientos podría fabricar un código con más puntos. No se ha intentado blindar; para un taller de 45 minutos con el profe delante es suficiente.

Para un marcador en tiempo real, implementa la interfaz `ScoreSync` de `src/core/scoresync.ts` (`publish`, `list`, `remove`, `clear`) con Supabase/Firebase y asígnala a `scoreSync`. El juego ya llama a `publish()` en cada reto resuelto y `/profe` ya lee con `list()`: no hay que tocar nada más. (Recuerda que con un backend habría datos de menores en un servidor: revisa RGPD y la política del centro.)

## Despliegue

Las rutas son páginas reales (`escritorio/index.html`, etc.), así que no hace falta configurar reescrituras de SPA. El base path se fija con `VITE_BASE`.

**Vercel**: importa el repo; framework «Vite», build `npm run build`, output `dist`. `vercel.json` activa `cleanUrls` y barra final.

**GitHub Pages**:
1. Sube el repo (sin `solutions/`, que ya está ignorado).
2. Settings → Pages → Source: **GitHub Actions**.
3. El workflow `.github/workflows/pages.yml` ejecuta los tests y compila con `VITE_BASE=/<nombre-del-repo>/`.

A mano: `VITE_BASE=/mi-repo/ npm run build` y publica `dist/`.

## Privacidad y seguridad

- Política CSP estricta en cada página (`default-src 'self'`, sin scripts externos, `form-action 'none'`), `referrer` desactivado, `noindex`.
- Sin fuentes, CDNs ni mapas externos. El progreso se guarda en `localStorage` (clave `ctf-laura:*`) solo en el dispositivo; nada sale de él.
- Ningún enlace de los retos es clicable y no hay formularios que recojan datos: los «portales» y «webs falsas» son capturas simuladas.
