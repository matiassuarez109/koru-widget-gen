# Koru Countdown Bar

Widget de barra de cuenta regresiva altamente personalizable para el ecosistema Koru. Diseñado para generar urgencia y aumentar conversiones mediante temporizadores flexibles y un diseño adaptable.

## 📋 Descripción del Proyecto

Koru Countdown Bar es un widget ligero construido en Vanilla JavaScript que permite:

✅ Crear temporizadores de oferta fija (fecha específica)
✅ Configurar temporizadores recurrentes diarios
✅ Implementar ofertas "Evergreen" personalizadas por usuario
✅ Gestionar la posición visual sin romper el layout del sitio (Smart Sticky)
✅ Personalizar estilos, mensajes y acciones al finalizar

## 🚀 Características Principales

### 1. Motor de Tiempo (TimeEngine)

- **To Date**: Cuenta regresiva hasta una fecha y hora específica.
- **Daily**: Reinicia la cuenta regresiva cada día a una hora configurada.
- **Evergreen**: Temporizador único por usuario (cookie/localstorage) que inicia cuando visitan el sitio.

### 2. Posicionamiento Inteligente

- **Sticky Top/Bottom**: Se fija arriba o abajo de la pantalla.
- **Detección de Header**: Detecta automáticamente otros elementos fijos (navbars, headers) para colocarse debajo de ellos sin superponerse.
- **Ajuste de Body**: Desplaza el contenido del sitio suavemente para evitar cortes.

### 3. Gestión de Finalización

- **Ocultar**: El widget desaparece al llegar a cero.
- **Mensaje**: Muestra un texto alternativo (ej: "Oferta Terminada").
- **Redirección**: Envía al usuario a otra URL automáticamente.

## 🛠 Stack Tecnológico

| Tecnología           | Propósito                                      |
| :------------------- | :--------------------------------------------- |
| **JavaScript (ES6)** | Lógica del widget y manipulación del DOM       |
| **Vite**             | Empaquetado y entorno de desarrollo (HMR)      |
| **Koru SDK**         | Clase base y utilidades del ecosistema         |
| **CSS Inyectado**    | Estilos encapsulados sin dependencias externas |
| **LocalStorage**     | Persistencia para temporizadores Evergreen     |

## 📁 Estructura de Carpetas

```text
koru-countdown-bar/
├── src/
│   └── index.js           # Lógica principal y estilos
├── dist/                  # Archivos compilados (UMD)
├── vite.config.js         # Configuración de Build
└── package.json           # Dependencias
```

## 🔄 Ciclo de Vida del Widget

`Init` -> `Render` -> `Tick (Interval)` -> `Finish/Destroy`

1.  **Init**: Lee la configuración y determina el tiempo objetivo.
2.  **Render**: Inyecta estilos y crea el DOM del widget.
3.  **Tick**: Actualiza el contador cada segundo.
4.  **Finish**: Ejecuta la acción final (Ocultar/Mensaje/Redirect).

## 🌳 Configuración del Widget (Modelo de Datos)

El widget acepta un objeto de configuración al inicializarse:

```javascript
WidgetConfig Structure
{
  position: string,                 // 'top-sticky', 'bottom-sticky', 'inline'
  timer_type: string,               // 'to-date', 'daily', 'evergreen'

  // Configuración de Tiempo
  end_date: string,                 // Fecha ISO para 'to-date'
  daily_end_time: string,           // Hora 'HH:MM' para 'daily'
  duration_min: number,             // Minutos para 'evergreen'

  // Acciones
  on_finish: string,                // 'message', 'hide', 'redirect'
  finish_message: string,           // Mensaje al terminar
  finish_url: string,               // URL para redirect

  // Contenido y Estilos
  message_text: string,             // Texto principal
  button_text: string,              // Texto del botón (opcional)
  button_link: string,              // Link del botón
  bg_color: string,                 // Hex color fondo
  text_color: string,               // Hex color texto
  show_days: boolean,               // Mostrar días en timer
  close_button: boolean             // Permitir cerrar widget
}
```

## 💻 Instalación y Setup

### Prerrequisitos

- Node.js >= 16
- npm

### Instalación

Clonar el repositorio y bajar dependencias:

```bash
git clone <repositorio-url>
cd koru-countdown-bar
npm install
```

### Desarrollo

Levantar entorno local con recarga en caliente:

```bash
npx vite
```

### Build para Producción

Generar el archivo optimizado en `dist/`:

```bash
npx vite build
```

## 🎨 Estilos y Diseño

- **Zero-Dependency**: No requiere frameworks CSS externos.
- **Variables CSS**: Usa variables nativas (`--kcd-bg`, `--kcd-text`) para fácil personalización.
- **Responsive**: Se adapta a móviles (stack vertical) y escritorio (horizontal).

## 📦 Dependencias Principales

```json
{
  "@redclover/koru-sdk": "^1.1.1",
  "vite": "^6.4.1"
}
```

## 📝 Scripts Disponibles

| Script (npx)   | Descripción                           |
| :------------- | :------------------------------------ |
| `vite`         | Inicia servidor de desarrollo         |
| `vite build`   | Compila para producción (formato UMD) |
| `vite preview` | Previsualiza el build generado        |

## 🚀 Deployment

El build genera un archivo único `koru-widget.umd.js` en `dist/`.

1.  Subir el archivo a un CDN o servidor estático.
2.  Incluir el script en el sitio destino.
3.  Inicializar el widget.

```html
<script src="path/to/koru-widget.umd.js"></script>
<script>
  new KoruCountdownBar().start({
    timer_type: "daily",
    message_text: "¡Oferta Flash!",
  });
</script>
```

## 📄 Licencia

Este proyecto es propiedad de Red Clover - Apps
