const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as 3rd argument');
  process.exit(1);
}

const password = process.argv[2];

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
  id: '1',
  name,
  number,
});

person.save().then(result => {
  console.log('Person saved', JSON.stringify(result));

  return Person.find({});
}).then((result) => {
  console.log('phonebook:\n');
  result.forEach(person => console.log(`${person}\n`));

  mongoose.connection.close();
});



