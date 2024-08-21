import { type Dictionary } from "@/get-dictionary"
import { Loader2Icon } from "lucide-react"

interface DeletingAccountDialogProps {
  dictionary: Dictionary["settings"]["user"]["deleteAccount"]
}

export const DeletingAccountDialog: React.FC<DeletingAccountDialogProps> = ({ dictionary }) => {
  return (
    <div className="fixed flex flex-col items-center justify-center inset-0 z-50 bg-surface">
      <Loader2Icon className="animate-spin size-16 text-surfaceVariant mb-3" />
      <h3 className="font-bold text-3xl pb-2.5">{dictionary.deletingAccountTitle}</h3>
      <p>{dictionary.deletingAccountDescription}</p>
    </div>
  )
}
