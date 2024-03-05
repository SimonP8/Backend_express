const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json()); // para analizar solicitudes con formato JSON
app.use(express.urlencoded({ extended: true })); // para analizar solicitudes con datos de formulario codificados en URL


// Endpoint para obtener todos los usuarios
app.get("/api/v1/users", async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany(); 
        res.status(200).json(usuarios); 
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Endpoint para obtener un usuario por ID
app.get("/api/v1/users/:id", async (req, res) => {
    const {id} = req.body; // 

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id: id }, 
        });

        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).send("Error interno del servidor");
    }
});
// Endpoint to create a new user
app.post("/api/v1/users", async (req, res) => {
    const { id, name, lastName, birthdate, address,password, mobile_phone, email,role } = req.body;

    try {
        const newUser = await prisma.usuario.create({
            data: {
                id: id,
                name: name,
                lastName: lastName,
                birthdate: birthdate,
                address: address,
                role: role,
                email: email,
                mobile_phone: mobile_phone,
                password: password
            },
        });

        res.status(201).json({
            success: true,
            message: "Usuario creado exitosamente",
            data: newUser
        });
    } catch (error) {
        console.error("Error creando el usuario", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Endpoint para actualizar un usuario
app.put("/api/v1/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, lastName, birthdate, address, password, mobile_phone, email, role } = req.body;

    try {
        const updatedUser = await prisma.usuario.update({
            where: { id: id },
            data: {
                name: name,
                lastName: lastName,
                birthdate: birthdate,
                address: address,
                role: role,
                email: email,
                mobile_phone: mobile_phone,
                password: password
            },
        });

        res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error actualizando el usuario", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Endpoint para eliminar un usuario
app.delete("/api/v1/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await prisma.usuario.delete({
            where: { id: id },
        });

        res.status(200).json({
            success: true,
            message: "Usuario eliminado exitosamente",
            data: deletedUser
        });
    } catch (error) {
        console.error("Error eliminando el usuario", error);
        res.status(500).send("Error interno del servidor");
    }
});
// Endpoint para Login

app.post("/api/v1/users/login", async (req, res) => {
    const { id,mobilePhone, password } = req.body; 

    console.log("Mobile Phone:", mobilePhone);
    console.log("Password:", password);

    const usuario = await prisma.usuario.findFirst({
        where: { mobile_phone: mobilePhone, password: password}, 
    });

    res.status(200).send({
        success: true,
        message: "Inicio de sesión exitoso",
        data: {
            id: usuario._id,
            name: usuario.name,
            email: usuario.email,
        },
    });

   const post = await prisma.Post.create({
        data: {
            id: id,
            mobilePhone: mobilePhone,
            password: password
        },
    });
    
});


const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});
