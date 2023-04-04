import '@/styles/globals.css'
import '@/styles/app.css'
import type { AppProps } from 'next/app'
import UserProvider from '@/context/UserProvider'
import AlertProvider from '@/context/AlertProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AlertProvider>
        <Component {...pageProps} />
      </AlertProvider>
    </UserProvider>
  )
}
