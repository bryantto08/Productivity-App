import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './navbar/navbar.js'
import { cookies } from 'next/headers'
import { ClientCookiesProvider } from './cookie-provider'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  return (
    <ClientCookiesProvider value={cookies().getAll()}>
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
    </ClientCookiesProvider>
  )
}
