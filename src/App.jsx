import { useState, useEffect } from 'react'

import Note from '../components/Note'
import noteService from "./services/notes"


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    noteService
      .getAll()
      .then(initialNotes => {
        console.log("Get all function runned")
        setNotes(initialNotes)
      })
  }, [])

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1)
    }
  
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)// find the note with the id in all the notes

    

    const changedNote = { ...note, important: !note.important } // change the note in this case the importance and ...note just copy's the other things from that note

    
    noteService
      .update(id, changedNote)
      .then(returnedNote => {

        setNotes(notes.map(n => n.id === id ? returnedNote : n)) // map thru notes check if you can find the one with the same id if notes contains one with the same id setNotes(response.data) else setNotes(n)
        
      })
      .catch(error => {
        alert(`The note ${note.content} was already deleted from the server`)
        console.log(error)

        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleDelete = (id) => {
    console.log(id)
    noteService
      .deleteNote(id)
      .then(() => {
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

  return (
    <div>

<button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>

      <form>
        <input onChange={(e) => setNewNote(e.target.value)} />
        <button onClick={addNote}>ADD</button>
      </form>

      <h1>Notes</h1> 
      {notesToShow.map((note) => (
        <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} handleDelete={handleDelete}/>
      ))}
    </div>
  )
}

export default App;
