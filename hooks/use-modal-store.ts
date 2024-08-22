"use client"

import type { GroupViewType } from "@/types/group/GroupType"
import type UserType from "@/types/UserType"
import { create } from "zustand"

export type ModalType =
  | "group-invite"
  | "edit-group"
  | "delete-group"
  | "exit-group"
  | "create-group"
  | "create-location"
  | "edit-profile"

interface ModalData {
  group?: GroupViewType
  locationName?: string
  user?: UserType
}

interface Modal {
  type: ModalType
  data?: ModalData
}

interface ModalStore {
  modals: Modal[]
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: (type: ModalType) => void
  onCloseAll: () => void
}

const useModalStore = create<ModalStore>((set) => ({
  modals: [],
  onOpen: (type, data = {}) =>
    set((state) => {
      // Prevent opening the same modal twice
      if (state.modals.some((modal) => modal.type === type)) return state

      return {
        modals: [...state.modals, { type, data }],
      }
    }),
  onClose: (type) =>
    set((state) => ({
      modals: state.modals.filter((modal) => modal.type !== type),
    })),
  onCloseAll: () => set({ modals: [] }),
}))

type ModalManager = {
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: (type: ModalType) => void
  onCloseAll: () => void
}

type ModalInstance = {
  type: ModalType
  isOpen: boolean
  data: ModalData
  onOpen: (data?: ModalData) => void
  onOpenOther: (otherType: ModalType, data?: ModalData) => void
  onClose: () => void
  onCloseAll: () => void
}

// Overload signatures to allow for optional type argument
export function useModal(): ModalManager
export function useModal(type: ModalType): ModalInstance

export function useModal(type?: ModalType): ModalInstance | ModalManager {
  const { modals, onOpen, onClose, onCloseAll } = useModalStore()

  if (type) {
    return {
      type,
      isOpen: modals.some((modal) => modal.type === type),
      data: modals.find((modal) => modal.type === type)?.data || {},
      onOpen: (data?: ModalData) => onOpen(type, data),
      onOpenOther: (otherType: ModalType, data?: ModalData) => onOpen(otherType, data),
      onClose: () => onClose(type),
      onCloseAll,
    } satisfies ModalInstance
  } else {
    return {
      onOpen,
      onClose,
      onCloseAll,
    } satisfies ModalManager
  }
}
