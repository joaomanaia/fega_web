"use client"

import { type Dictionary } from "@/get-dictionary"
import { createContext, useContext } from "react"

const DictionaryContext = createContext<Dictionary | null>(null)

interface DictionaryProviderProps {
  dictionary: Dictionary
  children: React.ReactNode
}

export default function DictionaryProvider({ dictionary, children }: DictionaryProviderProps) {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>
}

export function useDictionary() {
  const dictionary = useContext(DictionaryContext)
  
  if (dictionary === null) {
    throw new Error("useDictionary hook must be used within DictionaryProvider")
  }

  return dictionary
}
