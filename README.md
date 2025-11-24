📘 Dashboard de Jugadores – Trabajo Final Programación 4

Proyecto final desarrollado en React + Vite, basado en el examen asignado por el profesor (Versión: Fútbol).
Incluye todas las funcionalidades solicitadas: búsqueda con debounce, paginación dinámica, ordenamiento, modo oscuro, favoritos, historial, modal y estadísticas en tiempo real.

Deploy en Netlify: 
Repositorio: 

👨‍💻 Integrantes

-Juan Esteban Cuellar
-Abraham David Zea
-Juan Manuel Largo

IA utilizada para asistencia: ChatGPT (OpenAI GPT-5.1) – solo para apoyo técnico, no para reemplazar el desarrollo.

🚀 Tecnologías Utilizadas

React

Vite

JavaScript 

HTML5

CSS3 (metodología BEM)

GitHub

Netlify (Deploy)

📦 Instalación del Proyecto

Clona el repositorio:

git clone https://github.com/JuanEstebanCuellar/TrabajoFinal-Futbol-Programacion4.git

Entra al proyecto:

cd PaginaFutbolTrabajoFinal


Instala dependencias:

npm install


Ejecuta el proyecto:

npm run dev

🎯 Hooks Utilizados y Propósito
🟦 useState

Permite manejar estados del proyecto:

Estado de búsqueda

Paginación

Modo oscuro

Historial

Favoritos

Modal abierto/cerrado

Ordenamiento

Coloreo de filas

🟪 useEffect

Usado para:

Debounce de búsqueda

Persistir favoritos

Persistir modo oscuro

Persistir historial

Resetear paginación cuando cambia el filtro

Aplicar clases de tema al body

🟧 useMemo

Usado para optimizar:

Cálculo de estadísticas (promedio de edad, top scorer, total)

Ordenamiento

Filtros

⚙️ Funcionalidades Implementadas
🔍 1. Búsqueda con Debounce 

Filtra jugadores por nombre.

Usa useEffect con cleanup.

Incluye botón de limpiar búsqueda.

🎨 2. Coloreo de filas

Botón “Pintar pares”

Botón “Pintar impares”

Botón “Limpiar”

Manejado con useState

📄 3. Paginación dinámica

Selector de elementos por página: 5 / 10 / 20

Botones: Primera, Anterior, Siguiente, Última

Texto: “Mostrando X–Y de Z”

Reset al cambiar la búsqueda

🌓 4. Modo Oscuro / Claro

Persistente en localStorage

Cambia el tema global del sitio

📊 5. Estadísticas en tiempo real

Total jugadores visibles

Promedio de edad

Máximo goleador

Distribución por posición

Calculado con useMemo

🪟 6. Modal de detalles

Clic en una fila → abre detalle de jugador

Cerrar con botón o clic afuera

Animaciones suaves

⭐ 7. Sistema de favoritos

Guardado en localStorage

Icono de estrella por jugador

Filtro “Mostrar solo favoritos”

Contador total

📜 8. Historial de búsquedas

Guarda las últimas 5 búsquedas

Click para restaurar una búsqueda

Botón “Limpiar historial”

Persistente en localStorage


Trabajo realizado para la asignatura Programación 4, Universidad de Manizales.
