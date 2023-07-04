import '@/styles/globals.css'
import '@/styles/app.css'
import type { AppProps } from 'next/app'
import UserProvider from '@/context/UserProvider'
import AlertProvider from '@/context/AlertProvider'
import { useEffect, useState } from 'react'
import { api } from '@/config/api'
import ScreenAlert from '@/components/ui/ScreenAlert'

export default function App({ Component, pageProps }: AppProps) {
  const [systemMode, setSystemMode] = useState("ready");

  useEffect(() => {
    api.get('config/system-mode').then(res => {
      setSystemMode(res.data);
    }).catch(err => {
      console.log("error : ", err);
    })
  }, [])

  return (
    <UserProvider>
      <AlertProvider>
        <Component {...pageProps} />
        <ScreenAlert mode={systemMode} />
      </AlertProvider>
    </UserProvider>
  )
}
