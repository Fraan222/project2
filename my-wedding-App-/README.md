# Wedding Invitation App

Aplicación web de invitación de boda interactiva para Flor & Juan, construida con React, TypeScript y Tailwind CSS.

## Características

- **Pantalla de carga animada** con barra de progreso
- **Splash screen** de bienvenida con imagen de fondo
- **Video introductorio** de la pareja
- **Countdown timer** hasta el día de la boda
- **Formulario RSVP** para confirmación de asistencia
- **Galería de fotos** con carousel infinito
- **Secciones informativas**:
  - Fecha y hora del evento
  - Ubicación con mapa de Google Maps
  - Código de vestimenta
  - Información de precios
  - Lista de regalos
- **Diseño responsive** optimizado para móviles y escritorio
- **Animaciones y transiciones** suaves
- **Integración con Google Sheets** para guardar confirmaciones

## Tecnologías utilizadas

- React 19.2.4
- TypeScript 5.9.3
- Vite 7.2.4
- Tailwind CSS 4.1.18
- Lucide React (iconos)

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd my-wedding-App
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Construir para producción:
```bash
npm run build
```

5. Previsualizar la versión de producción:
```bash
npm run preview
```

## Configuración

### Variables importantes en App.tsx

- `weddingDate`: Fecha de la boda (línea 123)
- `GOOGLE_SCRIPT_URL`: URL del script de Google Apps para guardar confirmaciones (línea 122)
- `VIDEO_URL`: Ruta del video de la pareja (línea 126)
- `VIDEO_BACKGROUND_IMAGE`: Imagen de fondo para el video (línea 127)
- `carouselImages`: Array con las rutas de las imágenes de la galería (líneas 130-138)
- `novios`: Nombres de los novios (línea 140)

### Imágenes requeridas en la carpeta public/

- `/manos-anillo-horizontal.webp` - Splash screen
- `/hero-full-screen.webp` - Hero desktop
- `/abrazo-2do-outfit.webp` - Hero mobile
- `/Floryjuan-Reel-optimizdo.mp4` - Video de la pareja
- `/bosque-camino.webp` - Fondo de fecha/hora
- `/ful-screen-ubicacion.webp` - Fondo de ubicación
- `/dress-code-bg.webp` - Fondo de código de vestimenta
- Imágenes del carousel (ver lista en código)

## Estructura del proyecto

```
my-wedding-App/
├── public/              # Recursos estáticos (imágenes, videos)
├── src/
│   ├── App.tsx         # Componente principal
│   ├── main.tsx        # Punto de entrada
│   └── index.css       # Estilos globales
├── index.html          # HTML base
├── package.json        # Dependencias y scripts
├── tailwind.config.js  # Configuración de Tailwind
├── tsconfig.json       # Configuración de TypeScript
└── vite.config.ts      # Configuración de Vite
```

## Secciones de la aplicación

1. **Loading Screen** - Pantalla de carga con progreso
2. **Splash Screen** - Pantalla de bienvenida
3. **Video Section** - Video introductorio de la pareja
4. **Hero Section** - Countdown y botón RSVP principal
5. **Date & Time** - Información de fecha y horarios
6. **Location** - Mapa de Google Maps con ubicación
7. **Prices** - Información de precios de tarjetas
8. **Photo Gallery** - Carousel de fotos
9. **Dress Code** - Código de vestimenta
10. **Gifts** - Lista de regalos y datos para transferencias
11. **RSVP Modal** - Formulario de confirmación

## Funcionalidades del formulario RSVP

El formulario recopila:
- Nombre completo
- Email
- Teléfono
- Confirmación de asistencia
- Número de acompañantes
- Alergias alimentarias
- Preferencias alimentarias
- Mensaje opcional

Los datos se envían a Google Sheets mediante Google Apps Script.

## Personalización de colores (Tailwind)

Los colores personalizados están definidos en [tailwind.config.js](tailwind.config.js):
- `warm-taupe`: #C8A882
- `dark-espresso`: #4A3728
- `cream-beige`: #F5E6D3
- `silver-mist`: #D4D4D4
- `gray-sage`: #8B9A7C

## Autor

**Juan Cruz Mezzopeva**
Creado con 💖 para Florencia Montes & Juan Cruz Mezzopeva - 2026

## Licencia

**Copyright © 2026 Juan Cruz Mezzopeva. Todos los derechos reservados.**

Este software es propiedad exclusiva de Juan Cruz Mezzopeva y está protegido por leyes de derechos de autor.

### Uso Restringido

- ⚠️ **NO** está permitido copiar, modificar o distribuir este código sin autorización escrita
- ⚠️ **NO** está permitido usar este código con fines comerciales
- ⚠️ **NO** está permitido crear trabajos derivados
- ✅ Este repositorio puede ser público únicamente como **portfolio profesional** del autor

### Protección Legal

Este proyecto incluye una licencia propietaria completa. Ver [LICENSE-PROPRIETARY](LICENSE-PROPRIETARY) para términos completos.

**El software se proporciona "TAL CUAL", sin garantías de ningún tipo.** El autor no será responsable de ningún daño derivado del uso del software.

Cualquier uso no autorizado puede resultar en acciones legales según las leyes de propiedad intelectual de Argentina.

---

**Nota importante:** Si este repositorio es público, es SOLAMENTE para demostración de habilidades técnicas. La visualización pública NO otorga ninguna licencia de uso.
