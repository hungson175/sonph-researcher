'use client'

import { useSearchParams } from 'next/navigation'

export function SearchParamsWrapper({ children }) {
  const searchParams = useSearchParams()
  return children(searchParams)
}