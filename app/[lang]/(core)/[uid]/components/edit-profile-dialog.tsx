import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import UserType from "@/types/UserType"
import { EditProfileForm } from "./edit-profile-form"

interface EditProfileDialogProps {
  user: UserType
}

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ user }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <EditProfileForm user={user} />
      </DialogContent>
    </Dialog>
  )
}
