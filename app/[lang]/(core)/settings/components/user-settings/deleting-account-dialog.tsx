import { Loader2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

interface DeletingAccountDialogProps {
  deletingAccountTitle: string
  deletingAccountDescription: string
}

export const DeletingAccountDialog: React.FC<DeletingAccountDialogProps> = ({
  deletingAccountTitle,
  deletingAccountDescription,
}) => {
  const t = useTranslations("SettingsPage.user.deleteAccount")

  return (
    <div className="fixed flex flex-col items-center justify-center inset-0 z-50 bg-surface">
      <Loader2Icon className="animate-spin size-16 text-surfaceVariant mb-3" />
      <h3 className="font-bold text-3xl pb-2.5">{deletingAccountTitle}</h3>
      <p>{deletingAccountDescription}</p>
    </div>
  )
}
