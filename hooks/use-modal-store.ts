import { GroupViewType } from "@/types/group/GroupType"
import { create } from "zustand"

export type ModalType = "group-invite"

interface ModalData {
  group?: GroupViewType
}

interface ModalStore {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data) => set({ type, data, isOpen: true }),
  onClose: () => set({ type: null, data: {}, isOpen: false }),
}))