const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json())

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
}

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
  res.json(persons);
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if(!body.name || !body.number) {
    return res.status(400).json({error: errors.MISSSING_DATA});
  }

  if(persons.find(person => person.name === body.name)) {
    return res.status(400).json({error: errors.ALREADY_EXISTS});
  }

  const person = {
    id: Math.floor(Math.random() * 4444).toString(),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(person);

  res.json(person);
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

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});