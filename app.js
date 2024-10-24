import { PORT } from './config.js'
import { ServerMain } from './models/server.js'

const server = new ServerMain()

server.listen(PORT)
