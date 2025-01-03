const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const Person = require('./models/person')

const app = express();
const PORT = process.env.PORT || 3001;

morgan.token('postBody', function (req, res) { 
  return req.method === 'POST' ? `${JSON.stringify(req.body)}` : ''; 
});

app.use(cors());
app.use(express.json());
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'));

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

const errors = {
  'MISSSING_DATA': 'name or number missing of person',
  'ALREADY_EXISTS': 'The name already exists in the phonebook',
};

app.get('/', (req, res) => {
  res.send(`
    <h1>Phonebook</h1>
    <p><a href="/info">Info</a></p>
    <p><a href="/api/persons">Gull full list in JSON format</a></p>
  `);
});

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if(!body.name || !body.number) {
    return res.status(400).json({error: errors.MISSSING_DATA});
  }

  if(persons.find(person => person.name === body.name)) {
    return res.status(400).json({error: errors.ALREADY_EXISTS});
  }


  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then((personSaved) => {
    res.json(personSaved);
  });
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  const person = persons.find(person => person.id === id);

  if(person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id).then(() => {
    res.status(204).end();
  }).catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } 

  next(error);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});