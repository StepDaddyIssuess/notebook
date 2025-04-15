import express from "express";
import morgan from "morgan";
import cors from "cors"
import mongoose from "mongoose";
import Note from "./models/note.js";


const app = express();

app.use(express.json());
morgan.token('post-data', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});
app.use(morgan(':method :url :status :post-data - :response-time ms '))
app.use(cors())
app.use(express.static('dist'));


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

app.use(requestLogger);


app.get("/", (req, res) => {
    res.send("<h1>Hell World</h1>");
})

app.get("/api/notes", (req, res) => {
    Note.find({})
        .then(notes => res.json(notes))
})

app.get("/api/notes/:id", (req, res, next) => {
    const id = req.params.id
    Note.findById(id)
        .then(note => {
            if (note) {
                res.json(note);
            }
            else {
                res.status(404).end();
            }
        })
        .catch(error => {
            next(error)
        })
})

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id
    Note.findByIdAndDelete(id)
        .then((note) => {
            console.log("Deleted", note)
            res.json(note)
        })
        .catch(() => {
            console.log("couldnt find the note!")
            return res.status(404).end()
        })

})


app.post("/api/notes", (req, res, next) => {

    const body = req.body

    if (!body.content) {
        return res.status(400).json({
            error: "Content Missing!"
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
    })

    note.save()
        .then((savedNote) => {
            res.json(savedNote)
        })
        .catch(err => next(err))
})

app.put("/api/notes/:id", (req, res, next) => {
    const { content, important } = req.body

    Note.findById(req.params.id)
        .then(note => {
            if (!note) {
                return res.status(404).end();
            }

            note.content = content
            note.important = important

            return note.save().then((updatedNote) => {
                res.json(updatedNote)
            })
        })
        .catch(error => next(error));
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({
            error: "Malformatted id"
        })
    } else if (error.name === "ValidationError") {
        return res.status(400).json({
            error: error.message
        })
    }

    next(error)
}


app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
