import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'SmartWorkPlanet',
  description: 'Hire freelancers or sell your skills on SmartWorkPlanet',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
