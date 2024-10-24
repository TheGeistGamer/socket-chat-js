import { socketController } from '../sockets/socket-controller.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'

export class ServerMain {
  constructor () {
    this.app = express()

    this.httpSever = createServer(this.app)
    this.io = new Server(this.httpSever)

    // Middleware
    this.middlewares()

    // Rutas
    this.routes()

    // Sockets
    this.sockets()
  }

  middlewares () {
    // CORS
    this.app.use(cors())

    // Directorio Publico
    this.app.use(express.static('public'))
  }

  routes () {
  }

  sockets () {
    this.io.on('connection', (socket) => socketController(socket, this.io))
  }

  listen (PORT) {
    this.httpSever.listen(PORT, () => {
      console.log(`Server on port: http://localhost:${PORT}`)
    })
  }
}
