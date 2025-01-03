const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

morgan.token('postBody', function (req) {
  return req.method === 'POST' ? `${JSON.stringify(req.body)}` : ''
})

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

const errors = {
  'MISSSING_DATA': 'name or number missing of person',
  'ALREADY_EXISTS': 'The name already exists in the phonebook',
}

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if(!name || !number) {
    return res.status(400).json({ error: errors.MISSSING_DATA })
  }

  const person = new Person({
    name,
    number,
  })

  person.save().then((personSaved) => {
    res.json(personSaved)
  }).catch((error) => {
    next(error)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params

  Person.findById(id).then(person => {
    if(person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params

  const person = {
    number: req.body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      console.log(JSON.stringify(updatedPerson))
      res.json(updatedPerson)
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})