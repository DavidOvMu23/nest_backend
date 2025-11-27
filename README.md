# 🚀 CuidemJunts Backend API

Backend desarrollado con **NestJS** y **TypeORM** para la aplicación CuidemJunts, un sistema de seguimiento y acompañamiento telefónico para personas mayores en riesgo de soledad.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Modelo de Datos](#-modelo-de-datos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Documentación API](#-documentación-api)
- [Autenticación](#-autenticación)
- [Seeders](#-seeders)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 📖 Descripción

Este backend proporciona una API RESTful completa para gestionar:

- **Usuarios mayores** en seguimiento
- **Trabajadores** (supervisores y teleoperadores)
- **Comunicaciones** (llamadas telefónicas y su seguimiento)
- **Grupos** de trabajo
- **Notificaciones** del sistema
- **Contactos de emergencia**
- **Autenticación** y autorización con JWT

---

## 🛠 Tecnologías

### Core Framework
- **[NestJS](https://nestjs.com/)** v11 - Framework progresivo de Node.js
- **[TypeScript](https://www.typescriptlang.org/)** v5.7 - Superset tipado de JavaScript
- **[Node.js](https://nodejs.org/)** - Runtime de JavaScript

### Base de Datos
- **[PostgreSQL](https://www.postgresql.org/)** - Base de datos relacional
- **[TypeORM](https://typeorm.io/)** v0.3 - ORM para TypeScript y JavaScript

### Autenticación y Seguridad
- **[Passport](http://www.passportjs.org/)** - Middleware de autenticación
- **[JWT](https://jwt.io/)** - JSON Web Tokens para autenticación
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Hashing de contraseñas

### Documentación
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentación interactiva de la API

### Validación
- **[class-validator](https://github.com/typestack/class-validator)** - Validación basada en decoradores
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformación de objetos

### Testing
- **[Jest](https://jestjs.io/)** - Framework de testing
- **[Supertest](https://github.com/visionmedia/supertest)** - Testing de APIs HTTP

---

## 🏗 Arquitectura

El proyecto sigue la arquitectura modular de NestJS con los siguientes principios:

### Patrón de Diseño
- **Módulos**: Cada entidad tiene su propio módulo independiente
- **Controladores**: Manejo de rutas HTTP y validación de entrada
- **Servicios**: Lógica de negocio y operaciones con la base de datos
- **Entidades**: Modelos de datos con TypeORM
- **DTOs**: Data Transfer Objects para validación y transformación

### Módulos Principales

```
src/
├── usuario/           # Gestión de usuarios mayores
├── trabajador/        # Trabajadores (clase base)
├── supervisor/        # Supervisores (hereda de Trabajador)
├── teleoperador/      # Teleoperadores (hereda de Trabajador)
├── comunicacion/      # Registro de llamadas
├── grupo/             # Grupos de trabajo
├── notificacion/      # Sistema de notificaciones
├── contacto_emergencia/ # Contactos de emergencia
├── login/             # Autenticación y autorización
└── database/          # Seeders y configuración de BD
```

---

## 🗄 Modelo de Datos

### Entidades Principales

#### 👤 Usuario
Representa a las personas mayores en seguimiento.

```typescript
- dni (PK)
- nombre
- apellidos
- informacion
- estado_cuenta (activo/suspendido)
- f_nac
- nivel_dependencia
- datos_medicos_dolencias
- medicacion
- telefono
- direccion
```

#### 👨‍💼 Trabajador (Herencia STI)
Clase base para supervisores y teleoperadores.

```typescript
- id_trab (PK)
- nombre
- apellidos
- correo (unique)
- contrasena (hashed)
- rol (supervisor/teleoperador)
```

**Subclases:**
- **Supervisor**: Gestiona grupos y supervisa teleoperadores
- **Teleoperador**: Realiza llamadas y pertenece a un grupo

#### 📞 Comunicación
Registro de cada llamada realizada.

```typescript
- id_com (PK)
- fecha
- hora
- duracion
- resumen
- estado
- observaciones
- grupo (FK)
- usuario (FK)
```

#### 👥 Grupo
Equipos de trabajo de teleoperadores.

```typescript
- id_grupo (PK)
- nombre
- descripcion
- supervisor (FK)
- teleoperadores (relación 1:N)
- comunicaciones (relación 1:N)
```

#### 📧 Notificación
Sistema de notificaciones para trabajadores.

```typescript
- id_not (PK)
- mensaje
- fecha
- leida
- trabajador (FK)
```

#### 🆘 Contacto de Emergencia
Contactos de emergencia de los usuarios.

```typescript
- id_cont (PK)
- nombre
- apellidos
- telefono
- relacion
- usuarios (relación N:M)
```

### Relaciones

```mermaid
erDiagram
    USUARIO ||--o{ COMUNICACION : "tiene"
    USUARIO }o--o{ CONTACTO_EMERGENCIA : "tiene"
    GRUPO ||--o{ COMUNICACION : "registra"
    GRUPO ||--o{ TELEOPERADOR : "contiene"
    SUPERVISOR ||--o{ GRUPO : "supervisa"
    TRABAJADOR ||--o{ NOTIFICACION : "recibe"
    TRABAJADOR <|-- SUPERVISOR : "hereda"
    TRABAJADOR <|-- TELEOPERADOR : "hereda"
```

---

## 📦 Instalación

### Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/DavidOvMu23/Proyecto_CuidemJunts.git
cd Proyecto_CuidemJunts/Backend_CuidemJunts/nest_backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno** (ver sección [Configuración](#️-configuración))

4. **Inicializar la base de datos**
```bash
npm run db:setup
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

---

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=cuidemjunts

# Servidor
PORT=3000

# JWT (Autenticación)
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d
```

> ⚠️ **Importante**: Nunca subas el archivo `.env` al repositorio. Usa `.env.example` como plantilla.

### Ubicaciones de `.env`

El sistema busca el archivo `.env` en las siguientes ubicaciones (en orden):
1. `./env` (raíz del proyecto)
2. `../env` (un nivel arriba)
3. `../../env` (dos niveles arriba)

---

## 📜 Scripts Disponibles

### Desarrollo

```bash
# Iniciar en modo desarrollo con hot-reload
npm run start:dev

# Iniciar en modo debug
npm run start:debug
```

### Producción

```bash
# Compilar el proyecto
npm run build

# Iniciar en modo producción
npm run start:prod
```

### Base de Datos

```bash
# Ejecutar seeders (poblar BD con datos de prueba)
npm run db:setup
```

### Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

### Calidad de Código

```bash
# Formatear código con Prettier
npm run format

# Ejecutar linter
npm run lint
```

---

## 📚 Documentación API

### Swagger UI

Una vez iniciado el servidor, la documentación interactiva de la API está disponible en:

```
http://localhost:3000/api
```

### Endpoints Principales

#### Autenticación
```
POST   /login              # Iniciar sesión
POST   /login/register     # Registrar nuevo trabajador
```

#### Usuarios
```
GET    /usuario            # Listar todos los usuarios
GET    /usuario/:dni       # Obtener usuario por DNI
POST   /usuario            # Crear nuevo usuario
PUT    /usuario/:dni       # Actualizar usuario
DELETE /usuario/:dni       # Eliminar usuario
```

#### Trabajadores
```
GET    /trabajador         # Listar todos los trabajadores
GET    /trabajador/:id     # Obtener trabajador por ID
POST   /trabajador         # Crear nuevo trabajador
PUT    /trabajador/:id     # Actualizar trabajador
DELETE /trabajador/:id     # Eliminar trabajador
```

#### Comunicaciones
```
GET    /comunicacion       # Listar todas las comunicaciones
GET    /comunicacion/:id   # Obtener comunicación por ID
POST   /comunicacion       # Registrar nueva comunicación
PUT    /comunicacion/:id   # Actualizar comunicación
DELETE /comunicacion/:id   # Eliminar comunicación
```

#### Grupos
```
GET    /grupo              # Listar todos los grupos
GET    /grupo/:id          # Obtener grupo por ID
POST   /grupo              # Crear nuevo grupo
PUT    /grupo/:id          # Actualizar grupo
DELETE /grupo/:id          # Eliminar grupo
```

#### Notificaciones
```
GET    /notificacion       # Listar todas las notificaciones
GET    /notificacion/:id   # Obtener notificación por ID
POST   /notificacion       # Crear nueva notificación
PUT    /notificacion/:id   # Marcar como leída
DELETE /notificacion/:id   # Eliminar notificación
```

---

## 🔐 Autenticación

### JWT (JSON Web Tokens)

El sistema utiliza JWT para la autenticación de trabajadores (supervisores y teleoperadores).

#### Flujo de Autenticación

1. **Login**: El trabajador envía sus credenciales (correo y contraseña)
2. **Validación**: El servidor verifica las credenciales
3. **Token**: Si son válidas, se genera un JWT
4. **Autorización**: El cliente incluye el token en las peticiones subsiguientes

#### Uso del Token

Incluir el token JWT en el header `Authorization` de las peticiones:

```http
Authorization: Bearer <tu_token_jwt_aqui>
```

#### Ejemplo de Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "supervisor@cuidemjunts.com",
    "contrasena": "password123"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "trabajador": {
    "id_trab": 1,
    "nombre": "Juan",
    "apellidos": "García",
    "correo": "supervisor@cuidemjunts.com",
    "rol": "supervisor"
  }
}
```

---

## 🌱 Seeders

El proyecto incluye seeders para poblar la base de datos con datos de prueba.

### Ejecutar Seeders

```bash
npm run db:setup
```

### Datos de Prueba Incluidos

- **Grupos**: 3 grupos de trabajo
- **Trabajadores**: 
  - 3 supervisores
  - 9 teleoperadores (3 por grupo)
- **Usuarios**: 20 personas mayores
- **Contactos de Emergencia**: 30 contactos
- **Comunicaciones**: 50 registros de llamadas
- **Notificaciones**: 15 notificaciones

### Credenciales de Prueba

**Supervisor:**
```
Correo: supervisor1@cuidemjunts.com
Contraseña: password123
```

**Teleoperador:**
```
Correo: teleoperador1@cuidemjunts.com
Contraseña: password123
```

> 🔒 **Nota**: Todas las contraseñas están hasheadas con bcrypt.

---

## 📁 Estructura del Proyecto

```
nest_backend/
├── src/
│   ├── comunicacion/          # Módulo de comunicaciones
│   │   ├── comunicacion.controller.ts
│   │   ├── comunicacion.service.ts
│   │   ├── comunicacion.entity.ts
│   │   ├── comunicacion.module.ts
│   │   └── dto/
│   │
│   ├── contacto_emergencia/   # Módulo de contactos de emergencia
│   ├── grupo/                 # Módulo de grupos
│   ├── login/                 # Módulo de autenticación
│   ├── notificacion/          # Módulo de notificaciones
│   ├── supervisor/            # Módulo de supervisores
│   ├── teleoperador/          # Módulo de teleoperadores
│   ├── trabajador/            # Módulo base de trabajadores
│   ├── usuario/               # Módulo de usuarios
│   │
│   ├── database/              # Configuración de BD y seeders
│   │   └── seeds/
│   │       ├── comunicacion.seed.ts
│   │       ├── contacto_emergencia.seed.ts
│   │       ├── grupo.seed.ts
│   │       ├── notificacion.seed.ts
│   │       ├── trabajador.seed.ts
│   │       ├── usuario.seed.ts
│   │       └── usuario_contacto.seed.ts
│   │
│   ├── app.module.ts          # Módulo raíz
│   ├── app.controller.ts      # Controlador raíz
│   ├── app.service.ts         # Servicio raíz
│   ├── main.ts                # Punto de entrada
│   └── seed.ts                # Script de seeders
│
├── test/                      # Tests e2e
├── dist/                      # Código compilado
├── node_modules/              # Dependencias
│
├── .env                       # Variables de entorno (no versionado)
├── .gitignore                 # Archivos ignorados por Git
├── .prettierrc                # Configuración de Prettier
├── eslint.config.mjs          # Configuración de ESLint
├── nest-cli.json              # Configuración de Nest CLI
├── package.json               # Dependencias y scripts
├── tsconfig.json              # Configuración de TypeScript
├── tsconfig.build.json        # Configuración de build
├── data-source.ts             # Configuración de TypeORM
├── pm2.json                   # Configuración de PM2
└── README.md                  # Este archivo
```

---

## 🔧 Características Técnicas

### Validación de Datos
- DTOs con decoradores de `class-validator`
- Validación automática en todos los endpoints
- Mensajes de error descriptivos

### Manejo de Errores
- Excepciones personalizadas
- Códigos HTTP apropiados
- Logs estructurados

### Seguridad
- Contraseñas hasheadas con bcrypt (10 rounds)
- Autenticación JWT
- Validación de tokens en rutas protegidas
- CORS configurado

### Base de Datos
- Migraciones automáticas (modo desarrollo)
- Relaciones bien definidas
- Índices en campos clave
- Soft deletes donde corresponde

### Documentación
- Swagger/OpenAPI completamente integrado
- DTOs documentados
- Ejemplos de peticiones y respuestas

---

## 🚀 Despliegue

### Usando PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Compilar el proyecto
npm run build

# Iniciar con PM2
pm2 start pm2.json

# Ver logs
pm2 logs

# Reiniciar
pm2 restart cuidemjunts-api

# Detener
pm2 stop cuidemjunts-api
```

### Docker (Próximamente)

```bash
# Construir imagen
docker build -t cuidemjunts-api .

# Ejecutar contenedor
docker run -p 3000:3000 cuidemjunts-api
```

---

## 🧪 Testing

### Estructura de Tests

```
test/
├── app.e2e-spec.ts           # Tests end-to-end
└── jest-e2e.json             # Configuración de Jest para e2e
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:cov

# Tests e2e
npm run test:e2e
```

---

## 📝 Convenciones de Código

### Nomenclatura
- **Archivos**: `kebab-case.ts`
- **Clases**: `PascalCase`
- **Funciones/Variables**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`

### Estructura de Módulos
Cada módulo sigue la estructura:
```
modulo/
├── modulo.controller.ts    # Endpoints HTTP
├── modulo.service.ts       # Lógica de negocio
├── modulo.entity.ts        # Modelo de datos
├── modulo.module.ts        # Definición del módulo
└── dto/                    # Data Transfer Objects
    ├── create-modulo.dto.ts
    └── update-modulo.dto.ts
```

---

## 🤝 Contribución

### Workflow de Git

1. Crear una rama desde `main`
```bash
git checkout -b feature/nueva-funcionalidad
```

2. Hacer commits descriptivos
```bash
git commit -m "feat: añadir endpoint para estadísticas"
```

3. Push y crear Pull Request
```bash
git push origin feature/nueva-funcionalidad
```

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, punto y coma, etc.
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

---

## 📄 Licencia

Este proyecto es privado y está en desarrollo interno. No está disponible para uso público.

---

## 👥 Equipo

Desarrollado por el equipo de **CuidemJunts** como parte del proyecto intermodular de 2º DAM.

---

## 📞 Soporte

Para preguntas o problemas, contactar con los responsables del proyecto.

---

**Gracias por ayudar a cuidar juntos a quienes más lo necesitan.** 💙