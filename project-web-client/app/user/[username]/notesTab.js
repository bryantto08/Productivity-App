'use client'
import Link from 'next/link';
import { Fragment, useState } from "react";
import { useParams } from 'next/navigation'
import { ListNotes } from '@/app/apis/note';
import styles from '../user.module.css';
// https://nextjs.org/learn-pages-router/basics/dynamic-routes/dynamic-routes-details

/**
 * Next Steps: Get all apis to work in SSR pages.js, and then add the notes and username to this page using props (like variables to a function).
 * Then you can prob add the other apis here to with onClick functionality.
 * The first step though is to render the page first, and we do that by calling api in page.js and then sending the data here to INITIALIZE useState for notes
 */
// export default function NoteTab({params}) {
//     const [notes, setNotes] = useState(ListNotes(useParams()['username']));
//     console.log(notes);
//     return (
//         <div>
//             <h1>Welcome Back, {useParams()['username']}!</h1>
//             <div className={styles.notesContainer}>
//                 {
//                 notes['notes'].map((note) => (
//                 <div key={note.id} className={styles.noteBox}>
//                     <p>{note.name}</p>
//                     </div>
//                 ))
//                 }
//             </div>
//         </div>
//     );
// }