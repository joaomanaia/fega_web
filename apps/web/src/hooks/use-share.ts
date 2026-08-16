"use client"

import { create } from "zustand"

interface Data {
  dialogTitle: string
  dialogDescription?: string
  url: string
  text: string
  hideSocials?: boolean
  hideCopyUrl?: boolean
}

interface ShareStore {
  data: Data | null
  onShare: (data: Data) => void
  onCancel: () => void
}

export const useShare = create<ShareStore>((set) => ({
  data: null,
  onShare: (data) => set({ data: data }),
  onCancel: () => set({ data: null }),
}))
