import { useEffect, useState } from 'react'

export function useClientName(): string {
  const [clientName, setClientName] = useState('default')

  useEffect(() => {
    // Obtener el subdominio del header o del hostname
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
    const parts = hostname.split('.')

    let name = 'default'
    if (parts.length > 2 && hostname !== 'localhost') {
      name = parts[0]
    }

    setClientName(name)
  }, [])

  return clientName
}