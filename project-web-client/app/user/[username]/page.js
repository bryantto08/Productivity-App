'use client'
import Link from 'next/link';

// https://nextjs.org/learn-pages-router/basics/dynamic-routes/dynamic-routes-details

// APP ROUTE VS PAGE ROUTE 
import { useRouter } from 'next/navigation'
 
export default function Page({params}) {
  const router = useRouter();
  return (
  <p>Welcome Back, {params.username}!</p>
    // if statement for if user is logged in AND auth, else some other rendered html
  ) 

}