export class Usuarios {
  constructor () {
    this.personas = []
  }

  addUser (id, nombre, sala) {
    const persona = { id, nombre, sala }

    this.personas.push(persona)

    return this.personas
  }

  getUser (id) {
    const persona = this.personas.filter(user => user.id === id)[0]
    return persona
  }

  getAllUser () {
    return this.personas
  }

  getUsersForChannel (sala) {
    const userOnRoom = this.personas.filter(user => user.sala === sala)

    return userOnRoom
  }

  borrarUser (id) {
    const personaBorrada = this.getUser(id)
    this.personas = this.personas.filter(user => user.id !== id)

    return personaBorrada
  }
}
