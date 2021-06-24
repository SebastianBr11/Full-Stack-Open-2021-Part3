require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })

  // const id = Number(req.params.id)
  // const person = persons.find(person => person.id === id)

  // if (person) {
  //   res.json(person)
  // } else {
  //   res.status(404).end()
  // }
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.name,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><div>${new Date()}</div>`,
  )
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
