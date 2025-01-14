# Proyecto: Plataforma IoT para una Raspberry Pi 3 B+

## Etapa 1: Mongo con Docker

Comandos útiles:

- `docker compose down`.
- `sudo rm -rf mongo/datadir`.
- `docker compose up --build -d`.

Prueba con MongoDB Compass:

!["url"](./imagenes/etapa1/1-url.png)

!["db"](./imagenes/etapa1/2-db.png)

## Etapa2: API REST para Mongo

### Gestión de usuarios

!["login"](./imagenes/etapa2/usuarios/1-login.png)

!["register"](./imagenes/etapa2/usuarios/2-register.png)

!["profile"](./imagenes/etapa2/usuarios/3-profile.png)

!["db"](./imagenes/etapa2/usuarios/4-db.png)

!["change-password"](./imagenes/etapa2/usuarios/5-change-password.png)

!["forgot-password"](./imagenes/etapa2/usuarios/6-forgot-password.png)

!["email"](./imagenes/etapa2/usuarios/7-email.png)

!["reset-password"](./imagenes/etapa2/usuarios/8-reset-password.png)

### Guardar telemetrías

