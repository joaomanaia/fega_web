import { ScreenModal } from "@/components/screen-modal"

export default function ModalGroupInfoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ScreenModal className="overflow-hidden flex flex-col items-center gap-4">
      {children}
    </ScreenModal>
  )
}
