import { create } from "zustand"

type MessageDialog = { type: "edit"; messageId: string; content: string }

interface MessageOptionsStore {
  dialog: MessageDialog | null
  openDialog: (dialog: MessageDialog) => void
  closeDialog: () => void
}

export const useMessageOptionsStore = create<MessageOptionsStore>((set) => ({
  dialog: null,
  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
}))
