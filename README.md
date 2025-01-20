# Proyecto: Plataforma IoT para una Raspberry Pi 3 B+

## Etapa 1: Mongo funcionando en Docker

Comandos útiles:

- `docker compose down`.
- `sudo rm -rf mongo/datadir`.
- `docker compose up --build -d`.

Prueba con MongoDB Compass:

!["url"](./imagenes/etapa1/1-url.png)

!["db"](./imagenes/etapa1/2-db.png)

## Etapa2: API REST para Mongo con Node y Express funcionando en Docker

### Gestión de los usuarios

Prueba con Postman:

!["login"](./imagenes/etapa2/usuarios/1-login.png)

!["jwt"](./imagenes/etapa2/usuarios/2-jwt.png)

!["create"](./imagenes/etapa2/usuarios/3-create.png)

!["db"](./imagenes/etapa2/usuarios/4-db.png)

!["me"](./imagenes/etapa2/usuarios/5-me.png)

!["change-password"](./imagenes/etapa2/usuarios/6-change-password.png)

!["forgot-password"](./imagenes/etapa2/usuarios/7-forgot-password.png)

!["email"](./imagenes/etapa2/usuarios/8-email.png)

!["reset-password"](./imagenes/etapa2/usuarios/9-reset-password.png)

### Gestión de los datos

Prueba con Postman:

!["req-params"](./imagenes/etapa2/data/1-req-params.png)

!["put"](./imagenes/etapa2/data/2-put.png)

!["db"](./imagenes/etapa2/data/3-db.png)

!["last"](./imagenes/etapa2/data/4-last.png)

!["all"](./imagenes/etapa2/data/5-all.png)

!["day"](./imagenes/etapa2/data/6-day.png)

!["from-to"](./imagenes/etapa2/data/7-from-to.png)

### Gestión de los dispositivos

Prueba con Postman:

!["create"](./imagenes/etapa2/dispositivos/1-create.png)

!["db"](./imagenes/etapa2/dispositivos/2-db.png)

!["all"](./imagenes/etapa2/dispositivos/3-all.png)

!["connectivity"](./imagenes/etapa2/dispositivos/4-connectivity.png)

!["group"](./imagenes/etapa2/dispositivos/5-group.png)

!["one"](./imagenes/etapa2/dispositivos/6-one.png)

📝TODO: Gestión de grupos, gestión de acciones, gestión de atributos.

## Etapa 3: Mosquitto funcionando en Docker

Prueba con mosquitto_sub y mosquitto_pub desde la terminal de Visual Studio Code:

!["pub-sub"](./imagenes/etapa3/1-pub-sub.png)

📝TODO: Agregar TLS.

## Etapa 4: Core con MQTT, Node y Express funcionando en Docker

### Telemetry Input Management o TIM

Prueba con mosquitto_pub desde la terminal de Visual Studio Code:

!["put-telemetry"](./imagenes/etapa4/1-put-telemetry.png)

!["db"](./imagenes/etapa4/2-db.png)

📝TODO: Poder hacer post.

📝TODO: Manejar otras rutas en el TIM.

📝TODO: hacer el modulo RPC.
