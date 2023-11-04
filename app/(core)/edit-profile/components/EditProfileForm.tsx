import UserType from "@/types/UserType"
import { EditAvatarImage } from "./EditAvatarImage"
import { defaultImgUrl } from "@/core/common"
import { Input } from "@/app/(core)/components/CreatePostInput"
import { SubmitButton } from "@/app/(core)/components/SubmitButton"
import saveProfile from "@/app/actions/user/saveProfileAction"

interface EditProfileFormProps {
  user: UserType
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  return (
    <form action={saveProfile} className="flex flex-col space-y-8 w-full xl:w-1/2 2xl:w-1/3">
      <h1 className="text-2xl">Edit Profile</h1>
      <div className="flex items-center justify-center">
        <EditAvatarImage avatarImage={user.avatar_url ?? defaultImgUrl} name={user.full_name} />
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="full_name">Full Name</label>
        <Input id="full_name" name="full_name" type="text" placeholder="Full Name" />
      </div>

      <SubmitButton text="Save" />
    </form>
  )
}
