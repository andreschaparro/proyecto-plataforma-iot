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

### Gestión de los usuarios

!["login"](./imagenes/etapa2/usuarios/1-login.png)

!["register"](./imagenes/etapa2/usuarios/2-register.png)

!["profile"](./imagenes/etapa2/usuarios/3-profile.png)

!["db"](./imagenes/etapa2/usuarios/4-db.png)

!["change-password"](./imagenes/etapa2/usuarios/5-change-password.png)

!["forgot-password"](./imagenes/etapa2/usuarios/6-forgot-password.png)

!["email"](./imagenes/etapa2/usuarios/7-email.png)

!["reset-password"](./imagenes/etapa2/usuarios/8-reset-password.png)

### Gestión de los datos

!["put"](./imagenes/etapa2/data/1-put.png)

!["db"](./imagenes/etapa2/data/2-db.png)

!["device"](./imagenes/etapa2/data/3-device.png)

!["device-day"](./imagenes/etapa2/data/4-device-day.png)

!["device-from-to"](./imagenes/etapa2/data/5-device-from-to.png)

📝TODO: Crear una ruta para obtener la ultima telemetría de un dispositivo.

### Gestión de los dispositivos

!["create"](./imagenes/etapa2/dispositivos/1-register.png)

!["db"](./imagenes/etapa2/dispositivos/2-db.png)

!["devices"](./imagenes/etapa2/dispositivos/3-devices.png)

!["one-device"](./imagenes/etapa2/dispositivos/4-one-device.png)

!["connectivity"](./imagenes/etapa2/dispositivos/5-connectivity.png)

📝TODO: Proteger rutas de la etapa 3 comprobando que el dispositivo exista.

📝TODO: Crear una ruta para actualizar el grupo.