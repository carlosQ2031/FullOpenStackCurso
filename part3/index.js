// Cargar variables de entorno desde el archivo .env (por ejemplo, PORT, MONGODB_URI)
require('dotenv').config()

// Importar módulos necesarios
const express = require('express')
const cors = require('cors')
const app = express()

// Importar el modelo Note desde la carpeta models (MongoDB)
const Note = require('./models/note')

/*
 * Middleware personalizado para registrar cada petición que llega al servidor
 */
const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

/*
 * Middlewares generales del servidor
 */

// Permitir peticiones desde otros orígenes (por ejemplo, desde localhost:3000 si usas React)
app.use(cors())

// Servir archivos estáticos desde las carpetas "dist" y "build" (útil si generas el frontend con Vite o React)
app.use(express.static('dist'))
app.use(express.static('build'))

// Convertir automáticamente el cuerpo de las peticiones JSON en objetos JavaScript
app.use(express.json())

// Registrar las peticiones en consola
app.use(logger)

/*
 * Rutas del servidor
 */

// Ruta raíz, devuelve un simple HTML
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// Obtener todas las notas desde MongoDB
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// Obtener una nota específica por ID
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end() // Nota no encontrada
      }
    })
    .catch(error => next(error)) // Manejo de errores (por ejemplo, ID mal formado)
})

// Eliminar una nota por ID desde MongoDB
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end() // 204: No Content (se eliminó correctamente)
    })
    .catch(error => next(error)) // Manejo de errores
})

// Crear una nueva nota
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  // Crear una nueva instancia del modelo Note
  const note = new Note({
    content: body.content,
    important: body.important || false, // Si no se envía "important", se pone false
  })

  // Guardar la nota en la base de datos
  note.save()
    .then(savedNote => {
      response.json(savedNote) // Devolver la nota guardada
    })
    .catch(error => next(error)) // Manejo de errores
})

// Actualizar una nota
app.put('/api/notes/:id', (request, response, next) => {
  const {content, important} = request.body

  Note.findByIdAndUpdate(request.params.id, 
    {content, important},
    { new: true, runValidators: true, context: 'query' })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

/*
 * Middleware para manejar endpoints desconocidos (404)
 */
app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
})

/*
 * Middleware para manejar errores generales (ahora extendido con ValidationError)
 */
app.use((error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
})

/*
 * Iniciar el servidor en el puerto definido en el archivo .env
 */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
