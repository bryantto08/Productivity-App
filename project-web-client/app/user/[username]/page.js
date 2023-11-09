import Link from 'next/link';
import { cookies } from 'next/headers';
import { Fragment } from "react";
import { ListNotes } from '@/app/apis/note';
import { sessionAuth } from '@/app/apis/auth';
import styles from '../user.module.css';
import NoteTab from './notesTab';
// https://nextjs.org/learn-pages-router/basics/dynamic-routes/dynamic-routes-details


//  <p>Welcome Back, {params.username}!</p>
    // if statement for if user is logged in AND auth, else some other rendered html

export default async function Page({params}) {
  const cookieStore = cookies();
  console.log(cookieStore.get('session-id'))
  const isAuth = await sessionAuth({username: params.username, sessionId: cookieStore.get('session-id')});
  const data = await ListNotes({username: params.username});
  console.log(data);
  return (
    <Fragment>
      { isAuth.success ? (
        <div>
          <p>success</p>
          <NoteTab data={data}/>
        </div>
      ) : (
        <p>fail</p>
      )
      }
    </Fragment>
  );
}