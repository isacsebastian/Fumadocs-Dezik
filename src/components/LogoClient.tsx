'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LogoClient() {
  const [clientName, setClientName] = useState('default')

  useEffect(() => {
    // Obtener el nombre del cliente del hostname
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const parts = hostname.split('.')

    let name = 'default'
    if (parts.length > 2 && hostname !== 'localhost') {
      // Si es apple.deziklabs.com → apple
      name = parts[0]
    }

    setClientName(name)
  }, [])

  // Intentar cargar el logo del cliente desde public/
  // Si existe un archivo logo.{ext} en public/{client}/, usarlo
  // Si no existe, usar /logo.svg por defecto
  const logoPath = `/${clientName}/logo.png`
  const fallbackLogoPath = '/logo.svg'

  return (
    <Link href="/" aria-label="Ir al inicio">
      <img
        src={logoPath}
        alt="Logotipo"
        className="page-logo"
        width={140}
        height={48}
        onError={(e) => {
          // Si el logo del cliente no existe, usar logo.svg por defecto
          const img = e.target as HTMLImageElement
          img.src = fallbackLogoPath
        }}
      />
    </Link>
  )
}