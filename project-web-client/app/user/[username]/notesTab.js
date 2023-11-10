'use client'
import Link from 'next/link';
import { Fragment, useState } from "react";
import { useParams } from 'next/navigation'
import { ListNotes, createNote, deleteNote, readNote, updateNote } from '@/app/apis/note';
import styles from '../user.module.css';
// https://nextjs.org/learn-pages-router/basics/dynamic-routes/dynamic-routes-details

/**
 * Next Steps: Get all apis to work in SSR pages.js, and then add the notes and username to this page using props (like variables to a function).
 * Then you can prob add the other apis here to with onClick functionality.
 * The first step though is to render the page first, and we do that by calling api in page.js and then sending the data here to INITIALIZE useState for notes
 */
export default function NoteTab({ data }) {
    const [notes, setNotes] = useState(data['notes']);  // List of Notes
    const [selectedNote, setSelectedNote] = useState();
    const [noteName, setNoteName] = useState('');
    const [noteContent, setNoteContent] = useState('');

    const handleNewNote = async () => {
        const res = await createNote(data['username'], {'text': 'Hello World'});
        setNotes(prevNotes => [...notes, res['data']]);
    }
    const handleNoteClick = async (note) => {
        setSelectedNote(note);
        setNoteName(note.name || '');
        setNoteContent(note.text || '');
      };
    const handleNoteNameChange = (event) => {
        setNoteName(event.target.value);
    }
    const handleNoteContentChange = (event) => {
        setNoteContent(event.target.value);
      };
    const handleSaveNote = async () => {
        const res = await updateNote(data['username'], {'note-id': selectedNote['_id'], 'text': noteContent, 'name': noteName});
        setSelectedNote((prevNote) => {
            prevNote.text = res.data.text;
            prevNote.name = res.data.name;
            return prevNote;
        })
        setNotes(prevNotes => {
            prevNotes = prevNotes.map((note) => {
                if (note['_id'] == selectedNote['_id']) {
                    note.name = selectedNote.name;
                }
                return note;
            })
            return prevNotes;
        });
        console.log(selectedNote);
    }
    const handleDeleteNote = async () => {
        const res = await deleteNote(data['username'], {'note-id': selectedNote['_id']});
        console.log(res);
        setNotes(prevNotes => {
            prevNotes = prevNotes.filter((note) => note['_id'] != selectedNote['_id'])
            return prevNotes;
        });
        setSelectedNote();
        setNoteName('');
        setNoteContent('');

    }
    return (
        <Fragment className={styles.noteTabContainer}>
            <div className={styles.notesContainer}>
                <h1>Welcome Back, {data['username']}!</h1>
                <button className={styles.newNoteButton} onClick={handleNewNote}>
                    New Note
                </button>

                    {
                    notes.map((note) => (
                    <button key={note.id} className={styles.noteBox} onClick={() => handleNoteClick(note)}>
                        <p>{note.name}</p>
                        </button>
                    ))
                    }
            </div>
            <div className={styles.selectedNoteContainer}>
                <h2>Selected Note</h2>
                <input type='text' className={styles.noteName} value={noteName} onChange={handleNoteNameChange}/>
                <button className={styles.newNoteButton} onClick={handleSaveNote}>
                    Save Note
                </button>
                <button className={styles.newNoteButton} onClick={handleDeleteNote}>
                    Delete Note
                </button>
                {selectedNote && (
                <div className={styles.selectedNote}>
                    <textarea
                    className={styles.noteEditor}
                    value={noteContent}
                    onChange={handleNoteContentChange}
                    placeholder="Type your note here..."
                    />
                </div>
                )}
            </div>
        </Fragment>
    );
}