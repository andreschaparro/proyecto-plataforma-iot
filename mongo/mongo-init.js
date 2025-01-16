// Crea el usuario para que la api se conecte a la base de datos
db.createUser({
    user: "iotuser",
    pwd: "iot123",
    roles: [
        {
            role: "readWrite",
            db: "iot"
        }
    ]
})

// Crea las colecciones de la base de datos
db.createCollection("iotAcciones")
db.createCollection("iotAtributos")
db.createCollection("iotDatos")
db.createCollection("iotDispositivos")
db.createCollection("iotGrupos")
db.createCollection("iotUsuarios")

// Crea el usuario admin por defecto de la plataforma
db.iotUsuarios.insertOne({
    name: "admin",
    email: "admin@admin.com",
    // El password "admin123" se debe cifrar en https://bcrypt-generator.com/ utilizando 10 rounds
    password: "$2a$10$qa1ZnRuxovoH.NUgOuwKZeC63pZvjilPNHx8hniuvAVKoqShazr32",
    role: "admin"
})