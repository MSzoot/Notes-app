import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, deleteDoc, doc, onSnapshot, setDoc, snapshotEqual } from "firebase/firestore"
import {notesCollection,db} from "./firebase"



export default function App() {
    const [notes, setNotes] = React.useState([])

    const [currentNoteId, setCurrentNoteId] = React.useState("")

    const [tempNoteText, setTempNoteText] = React.useState("")
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]


    const sortedNotesArr = notes.sort((a,b) => b.UpdatedAt - a.UpdatedAt)

    React.useEffect(() => {
       const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
        const notesArr = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        
        }))
        setNotes(notesArr)
        })
        return unsubscribe
    
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    },[notes])

    React.useEffect(() => {
        if (currentNote) {
           setTempNoteText(currentNote.body)
        }
    }, [currentNote])


    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateNote(tempNoteText)
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])


   async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            UpdatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

   async function updateNote(text) {
        const docRef = doc(db,"notes",currentNoteId)
        await setDoc(docRef,{ body: text, UpdatedAt: Date.now() },{merge:true})
    }

   async function deleteNote(noteId) {
       const docRef = doc(db,"notes",noteId)
       await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotesArr}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
