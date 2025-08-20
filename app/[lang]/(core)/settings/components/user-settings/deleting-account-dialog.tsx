import { Loader2Icon } from "lucide-react"

interface DeletingAccountDialogProps {
  deletingAccountTitle: string
  deletingAccountDescription: string
}

export const DeletingAccountDialog: React.FC<DeletingAccountDialogProps> = ({
  deletingAccountTitle,
  deletingAccountDescription,
}) => {
  return (
    <div className="bg-surface fixed inset-0 z-50 flex flex-col items-center justify-center">
      <Loader2Icon className="text-surface-variant mb-3 size-16 animate-spin" />
      <h3 className="pb-2.5 text-3xl font-bold">{deletingAccountTitle}</h3>
      <p>{deletingAccountDescription}</p>
    </div>
  )
}
