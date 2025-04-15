const Note = ({note, toggleImportance, handleDelete}) => {
    // console.log(props.note.content)

    // conditionally render label
    const label = note.important
        ? "Make not important"
        : "Make important"

    return (
        <li className="note">
            {note.content}
            <button onClick={toggleImportance}>{label}</button>
            <button onClick={() => {handleDelete(note.id)}}>Delete</button>
        </li>
    )
}


export default Note;