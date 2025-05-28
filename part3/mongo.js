const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url =`mongodb+srv://carlosquezadadev:${password}@cluster0.xcf1rfw.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
  content: "Browser can execute only JavaScript",
      important: false
});

//Codigo para cuargar una nueva nota
// note.save().then(() => {
//   console.log('note saved!');
//   mongoose.connection.close();
// });


//Codigo para obtener objetos de la base de datos

Note.find({important: true}).then(result =>{
  result.forEach(note=>{
    console.log(note)
  })  
  mongoose.connection.close();
})
