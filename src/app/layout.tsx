import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientWrapper } from '@/components/providers/ClientWrapper'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Análisis Numérico Interactivo',
  description: 'Aplicación web interactiva de métodos numéricos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <ClientWrapper>
          {children}
          <Toaster position="top-right" />
        </ClientWrapper>
      </body>
    </html>
  )
}