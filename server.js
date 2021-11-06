const express = require('express');
const path = require('path');
const fs = require('fs');
const { application } = require('express');
const { clog } = require('./middleware/clog')

const app = express();
const PORT = process.env.port || 3001;

//Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//Route to notes.html
app.get('/notes', (req, res) => {res.sendFile(path.join(__dirname, '/public/notes.html'))});

//route to read the db.json file 
app.get('/api/notes', (req, res) => {res.sendFile(path.join(__dirname, '/db/db.json'))});

//route to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.post('/api/notes', (req, res) => {
    let newNote = req.body
    let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    let noteLength = (noteList.length).toString();
    newNote.id = noteLength;
    noteList.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(noteList), 'utf8');
    res.json(noteList);
})

app.delete('/api/notes/:id', (req, res) => {
    let noteList = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'))
    let noteId = (req.params.id).toString();

    noteList = noteList.filter(selected => {
        return selected.id != noteId        
    })
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList), 'utf8');
    res.json(noteList);
})

app.listen(PORT, () =>console.log(`Example app listening at http://localhost:${PORT}`))
