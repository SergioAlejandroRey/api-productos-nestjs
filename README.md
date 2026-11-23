# API de Productos - NestJS

Backend para gestionar productos. Incluye registro de usuarios, inicio de sesión, validación de datos, contraseñas protegidas con bcrypt y rutas protegidas con JWT.

## Tecnologías

- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- bcrypt
- JWT

## Por qué PostgreSQL

Elegí PostgreSQL porque ya lo tenía instalado y lo conozco. pgAdmin 4 solo sirve para ver y administrar la base. La actividad no exige MySQL; TypeORM funciona igual con PostgreSQL.

## Requisitos

- Node.js 20 o superior
- npm
- PostgreSQL en ejecución
- pgAdmin 4 (opcional, para revisar la base)

## Paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/SergioAlejandroRey/api-productos-nestjs.git
cd api-productos-nestjs
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Crear la base de datos y el usuario

Ejecutar en la terminal:

```bash
psql -d postgres
```

Dentro de PostgreSQL:

```sql
CREATE USER productos_user WITH PASSWORD 'Sena2026*';
CREATE DATABASE productos_db OWNER productos_user;
\q
```

También se pueden crear la base y el usuario desde pgAdmin 4 con los mismos datos.

### 4. Configurar las variables de entorno

```bash
cp .env.example .env
```

Si cambiaste la contraseña de la base, actualiza `DB_PASSWORD` en `.env`.

El archivo `.env` no se sube a GitHub.

### 5. Ejecutar el proyecto

```bash
npm run start:dev
```

La API queda disponible en:

```text
http://localhost:3000
```

Al iniciar, TypeORM crea las tablas automáticamente.

### 6. Probar la API

No hay usuarios precargados. Primero se crea un usuario:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Sergio","email":"sergio@correo.com","password":"Clave123"}'
```

Después se inicia sesión:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sergio@correo.com","password":"Clave123"}'
```

El login devuelve un `access_token`. Ese token se envía en las rutas de productos:

```http
Authorization: Bearer <token>
```

## Rutas

| Método | Ruta | Token | Acción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Iniciar sesión |
| GET | `/productos` | Sí | Listar productos |
| GET | `/productos/:id` | Sí | Consultar un producto |
| POST | `/productos` | Sí | Crear producto |
| PATCH | `/productos/:id` | Sí | Modificar producto |
| DELETE | `/productos/:id` | Sí | Eliminar producto |

Las rutas de productos responden `401` si el token no se envía, es inválido o está vencido.
