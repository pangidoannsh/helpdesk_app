import '@/styles/globals.css'
import '@/styles/app.css'
import type { AppProps } from 'next/app'
import UserProvider from '@/context/UserProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}
