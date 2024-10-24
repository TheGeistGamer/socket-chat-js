const socket = io()

const params = new URLSearchParams(window.location.search)

if (!params.has('nombre') || !params.has('sala')) {
  window.location = 'index.html'
  throw new Error('El nombre y sala son necesarios')
}

const usuario = {
  nombre: params.get('nombre'),
  sala: params.get('sala')
}

// Usuarios conectados
socket.on('connect', function () {
  socket.emit('entrarChat', usuario, function (resp) {
    renderizarUsuarios(resp)
  })
})

// escuchar
socket.on('disconnect', function () {
  console.log('Perdimos conexión con el servidor')
})

// Escuchar información
socket.on('crearMensaje', function (mensaje) {
  renderizarMensaje(mensaje)
  scrollBottom()
})

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function (personas) {
  renderizarUsuarios(personas)
})

// Mensajes privados
socket.on('mensajePrivado', function (mensaje) {
  console.log('Mensaje Privado:', mensaje)
})
