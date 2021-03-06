const express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Adds a new note
app.post('/api/notes', function (req, res) {
    var newNote = req.body;
    //Read file
    fs.readFile('./db/db.json', 'utf8', function (err, data) {
        if ('21', err) throw err;
        let notes = JSON.parse(data);
        let newId = 1;
        if (notes.length < 1) {
            newNote.id = newId;
        } else {
            // find the hights value in id for notes
            for (i = 0; i < notes.length; i++) {
                let noteId = notes[i].id;
                if (noteId >= newId) {
                    newId = noteId;
                }
            }
            newNote.id = newId + 1;
        }

        notes.push(newNote);
        console.log(notes, newNote);
        // Write new file
        fs.writeFile('./db/db.json', JSON.stringify(notes), function (err) {
            if ("err", err) throw err;
        });
    });
    res.send(200);
});

// Gets all notes
app.get('/api/notes', function (req, res) {
    fs.readFile('./db/db.json', 'utf8', function (err, data) {
        if (err) throw err;
        res.send(JSON.parse(data));
    });
});

// Uses Id to filter notes array
app.delete('/api/notes/:id', function (req, res) {
    let deleteId = req.params.id;
    fs.readFile('./db/db.json', 'utf8', function (err, data) {
        if (err) throw err;
        notes = JSON.parse(data);
        var newNotes = notes.filter(test => test.id !== +deleteId);
        console.log(notes, newNotes, deleteId);
        fs.writeFile('./db/db.json', JSON.stringify(newNotes), function (err) {
            if (err) throw err;
        });
    });
    res.send(200);
});

// Default path
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
