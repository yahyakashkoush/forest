import './globals.css'
import { Inter, Cinzel } from 'next/font/google'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })
const cinzel = Cinzel({ subsets: ['latin'] })

export const metadata = {
  title: 'Forest - Born from the heart of the forest',
  description: 'Discover the mysterious world of Forest fashion - where darkness meets elegance in an abandoned forest setting.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}