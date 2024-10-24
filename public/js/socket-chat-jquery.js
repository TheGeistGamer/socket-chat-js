// Funcioens para renderizar usuarios
const paramsChat = new URLSearchParams(window.location.search)
const nombre = paramsChat.get('nombre')
const sala = paramsChat.get('sala')

// Referencias
const divUsuarios = $('#divUsuarios')
const formEnviar = $('#formEnviar')
const txtMensaje = $('#txtMensaje')
const divChatBox = $('#divChatbox')

function renderizarUsuarios (personas) {
  let html = `<li> <a href="javascript:void(0)" class="active"> Chat de <span>${sala}</span></a></li>`

  for (let i = 0; i < personas.length; i++) {
    html += ` <li>
                <a data-id=${personas[i].id} href="javascript:void(0)">
                  <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> 
                  <span>${personas[i].nombre}<small class="text-success">online</small></span>
                </a>
              </li>`
  }

  divUsuarios.html(html)
}

function renderizarMensaje (mensaje, my = false) {
  const time = new Date(mensaje.fecha)
  const hora = time.getHours() + ':' + time.getMinutes()
  const isAdmin = (mensaje.nombre === 'Administrador')

  let adminClass = 'info'
  if (isAdmin) adminClass = 'danger'

  const html = `                              
  <li class="animated fadeIn">
    ${!isAdmin ? '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>' : ''}
    <div class="chat-content">
        <h5>${mensaje.nombre}</h5>
        <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
    </div>
    <div class="chat-time">10:56 am</div>
  </li>`

  const htmlReverse = `
    <li class="reverse animated fadeIn">
      <div class="chat-content">
        <h5>${mensaje.nombre}</h5>
        <div class="box bg-light-inverse">${mensaje.mensaje}</div>
      </div>
      <div class="chat-img"><img src="assets/images/users/5.jpg" alt="Usuarios" /></div>
      <div class="chat-time">${hora}</div>
    </li>
  `
  if (my) return divChatBox.append(htmlReverse)
  divChatBox.append(html)
}

// Listeners
divUsuarios.on('click', 'a', function () {
  const id = $(this).data('id')
  if (id) console.log(id)
})

formEnviar.on('submit', function (ev) {
  ev.preventDefault()
  const mensaje = txtMensaje.val().trim()
  if (mensaje.length === 0) return

  socket.emit('crearMensaje', {
    nombre,
    mensaje
  }, function (msj) {
    txtMensaje.val('').focus()
    renderizarMensaje(msj, true)
    scrollBottom()
  })
})

function scrollBottom() {
  // selectors
  const newMessage = divChatBox.children('li:last-child')

  // heights
  const clientHeight = divChatBox.prop('clientHeight')
  const scrollTop = divChatBox.prop('scrollTop')
  const scrollHeight = divChatBox.prop('scrollHeight')
  const newMessageHeight = newMessage.innerHeight()
  const lastMessageHeight = newMessage.prev().innerHeight() || 0

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    divChatBox.scrollTop(scrollHeight)
  }
}
