import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(url)
    .then(() => {
        console.log("DB is running!")
    })
    .catch((error) => {
        console.log(error.message)
    })

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean

})

noteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model("Note", noteSchema);
export default Note;

