const express = require('express');
const app = express();

const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});