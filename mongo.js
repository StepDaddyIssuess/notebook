import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URL;
console.log(url);

mongoose.set("strictQuery", false);

mongoose.connect(url)
    .then(() => {
        console.log("DB is running!")
    })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
    content: "JAVASCRIPT IS VERY HARD",
    important: true
})

// note.save()
//     .then((res) => {
//         console.log(res)
//         console.log("Note SaveD!")
//         mongoose.connection.close()
//     })

Note.find({ important: false })
    .then((res) => {
        res.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })


