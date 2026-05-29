# Portal de Transparencia Municipal - Frontend

Este repositorio contiene la aplicación de frontend desarrollada en React + TypeScript para el Portal de Gestión Financiera y Transparencia de la Municipalidad de Santo Domingo.

## 🚀 Tecnologías

* **Framework:** React (Vite)
* **Lenguaje:** TypeScript
* **Estilos:** Tailwind CSS
* **Comunicación:** Axios con Interceptores JWT
* **Contenedor:** Docker (Nginx para producción, Node.js para desarrollo)

## 📋 Requisitos Previos

* Docker instalado.
* Node.js (opcional, si no usas Docker para ejecutar comandos).

## 🛠️ Entorno de Desarrollo (Hot Reload)

Para trabajar en el código con actualizaciones automáticas al guardar cambios, utiliza el entorno de desarrollo configurado con Vite:

1. **Levantar el contenedor en segundo plano:**
   ```bash
   docker compose -f compose.dev.yaml up -d
   ```
2. **La aplicación estará disponible en:** [http://localhost:8080](http://localhost:8080)

> **Nota:** El contenedor instalará automáticamente las dependencias necesarias al iniciar.

## 🔑 Credenciales de Prueba

Para acceder al panel de administración, usa las siguientes credenciales:

| Campo       | Valor                      |
|-------------|----------------------------|
| **Usuario** | `usuario@santodomingo.cl`  |
| **Contraseña** | `Usuario1234`           |

> **Nota:** Asegúrate de que el backend esté corriendo y accesible desde la URL configurada en `VITE_API_URL`.

## 🚢 Entorno de Producción

Para desplegar la aplicación empaquetada y optimizada con Nginx:

1. **Construir y levantar el contenedor:**
   ```bash
   docker compose up -d --build
   ```
2. **La aplicación será servida en:** [http://localhost:8080](http://localhost:8080)

## 🐳 Comandos Útiles de Docker para el Día a Día

Utiliza estos comandos para administrar los contenedores de la aplicación:

* **Ver estado de los contenedores:**
  ```bash
  docker ps
  ```
* **Ver registros (logs) en tiempo real:**
  ```bash
  docker compose logs -f
  ```
* **Detener y remover los contenedores:**
  ```bash
  docker compose down
  ```
* **Reiniciar los servicios:**
  ```bash
  docker compose restart
  ```

### 💡 Significado de las banderas (flags) utilizadas:
* `-d` / `--detach`: Ejecuta el contenedor en segundo plano, liberando tu terminal.
* `--build`: Fuerza la reconstrucción de la imagen antes de levantar el contenedor.
* `-f`: Especifica un archivo de configuración de Compose personalizado (ej. `compose.dev.yaml`).
* `-f` (en logs): Sigue la salida de los registros en tiempo real (follow).

## 📂 Estructura del Proyecto

* `src/services/`: Capa de comunicación con la API (Axios con interceptores JWT).
* `src/pages/`: Vistas principales de la aplicación (login, admin, etc.).
* `src/components/ui/`: Componentes base (shadcn/ui).

## 🔐 Configuración de Variables

Asegúrate de crear un archivo `.env` en la raíz (basado en el archivo `.env.example`) con la siguiente variable:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Notas de Integración

La autenticación se gestiona mediante tokens JWT almacenados en `localStorage`. El servicio `api.ts` inyecta automáticamente el encabezado `Authorization: Bearer <token>` en todas las peticiones protegidas hacia el backend.

El login redirige según el rol del usuario:
* **ADMIN** → `/admin/dashboard`
* **Otros roles** → `/home`
