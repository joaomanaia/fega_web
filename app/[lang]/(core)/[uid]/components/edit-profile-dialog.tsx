import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type UserType from "@/types/UserType"
import { EditProfileForm } from "./edit-profile-form"
import { type Dictionary } from "@/get-dictionary"

interface EditProfileDialogProps {
  user: UserType
  dictionary: Dictionary
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ user, dictionary }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.editProfile.header}</DialogTitle>
        </DialogHeader>
        <EditProfileForm user={user} dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  )
}
