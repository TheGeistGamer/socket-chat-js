/* eslint-disable n/no-callback-literal */
import { Usuarios } from '../class/usuarios.js'
import { crearMensaje } from '../util/utilidades.js'

const usuarios = new Usuarios()

export const socketController = (socket, io) => {
  socket.on('entrarChat', (user, callback) => {
    if (!user.nombre || !user.sala) return callback({ error: true, mensaje: 'El nombre es necesario' })

    // Unir a la sala especificada
    socket.join(user.sala)

    // Agregamos el usuario
    usuarios.addUser(socket.id, user.nombre, user.sala)

    // Enviar los usuarios conectados
    socket.broadcast.to(user.sala).emit('listaPersona', usuarios.getUsersForChannel(user.sala))
    socket.broadcast.to(user.sala).emit('crearMensaje', crearMensaje('Administrador', `${user.nombre} se unió`))

    callback(usuarios.getUsersForChannel(user.sala))
  })

  // Usuario se desconecto
  socket.on('disconnect', () => {
    const userDisconnect = usuarios.borrarUser(socket.id)

    socket.broadcast.to(userDisconnect.sala).emit('crearMensaje', crearMensaje('Administrador', `${userDisconnect.nombre} salio`))
    // Enviar los usuarios conectados
    socket.broadcast.to(userDisconnect.sala).emit('listaPersona', usuarios.getUsersForChannel(userDisconnect.sala))
  })

  // Enviar mensajes a todos los usuarios
  socket.on('crearMensaje', (data, callback) => {
    const user = usuarios.getUser(socket.id)

    const mensaje = crearMensaje(user.nombre, data.mensaje)
    socket.broadcast.to(user.sala).emit('crearMensaje', mensaje)
    callback(mensaje)
  })

  // Enviar mensaje privado
  socket.on('mensajePrivado', (data) => {
    const user = usuarios.getUser(socket.id)

    socket.broadcast.to(data.to).emit('mensajePrivado', crearMensaje(user.nombre, data.mensaje))
  })
}
