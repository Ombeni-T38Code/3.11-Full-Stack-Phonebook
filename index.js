const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// app.use(express.static('dist'))

const app = express()

app.use(cors())
// Middleware
app.use(express.json())

app.use(express.static('dist'))

app.use(morgan('tiny'))

// Custom Morgan token
morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

// Morgan configuration
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  },
  {
    id: "5",
    name: "John Doe",
    number: "123-4567890"
  }
]

// HOME
app.get('/', (request, response) => {
  response.send('<h1>Phonebook API</h1>')
})

// GET ALL + FILTER
app.get('/api/persons', (request, response) => {
  const { name } = request.query

  if (!name) {
    return response.json(persons)
  }

  const filtered = persons.filter(person =>
    person.name.toLowerCase().includes(name.toLowerCase())
  )

  response.json(filtered)
})

// INFO
app.get('/info', (request, response) => {
  const date = new Date()

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// GET ONE PERSON
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({
      error: `Person with id ${id} not found`
    })
  }
})

// DELETE PERSON
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  persons = persons.filter(person => person.id !== id)

  response.status(200).send(`Person with id ${id} deleted`)
})

// ADD NEW PERSON
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Missing name
  if (!body.name) {
    return response.status(400).json({
      error: 'name is missing'
    })
  }

  // Missing number
  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  // Duplicate name
  const nameExists = persons.find(
    person => person.name.toLowerCase() === body.name.toLowerCase()
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  // Create new person
  const person = {
    id: Math.floor(Math.random() * 1000000).toString(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3010


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})



// app.listen(PORT, () => {
//   console.log(`Server running on port http://localhost:${PORT}`)
// })