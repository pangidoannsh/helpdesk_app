import '@/styles/globals.css'
import '@/styles/app.css'
import type { AppProps } from 'next/app'
import UserProvider from '@/context/UserProvider'
import AlertProvider from '@/context/AlertProvider'
import { Router } from 'next/router'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [loadingPage, setloadingPage] = useState(false);
  // Router.events.on("routeChangeStart", (url) => {
  //   if (url === '/layanan') setloadingPage(true);

  // })
  // Router.events.on("routeChangeComplete", (url) => {
  //   setloadingPage(false)
  // })
  return (
    <UserProvider>
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </UserProvider>
  )
  if (!loadingPage) {
  }
  return <div>loading...</div>
}
