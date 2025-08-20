import { ScreenModal } from "@/components/screen-modal"

export default function ModalGroupInfoLayout({
  children,
}: LayoutProps<"/[lang]/groups/[id]/info">) {
  return (
    <ScreenModal className="flex flex-col items-center gap-4 overflow-hidden">
      {children}
    </ScreenModal>
  )
}
