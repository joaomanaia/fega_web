"use client"

import UserType from "@/types/UserType"
import { EditAvatarImage } from "./EditAvatarImage"
import { defaultImgUrl } from "@/core/common"
import { Input } from "@/app/(core)/components/CreatePostInput"
import { SubmitButton } from "@/app/(core)/components/SubmitButton"
import saveProfile from "@/app/actions/user/saveProfileAction"
import { useFormState } from "react-dom"
import { InfoMessage } from "./InfoMessage"

interface EditProfileFormProps {
  user: UserType
}

const initialState = {
  successMessage: "",
  fullNameError: "",  
  errorMessage: "",
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const [state, formAction] = useFormState(saveProfile, initialState)

  return (
    <form action={formAction} className="flex flex-col space-y-8 w-full xl:w-1/2 2xl:w-1/3">
      <h1 className="text-2xl">Edit Profile</h1>
      <div className="flex flex-col space-y-2 items-center justify-center">
        <input accept="image/*" type="file" name="avatar_url" id="avatar_url" hidden />
        <label htmlFor="avatar_url">
          <EditAvatarImage
            disabled
            avatarImage={user.avatar_url ?? defaultImgUrl}
            name={user.full_name}
          />
        </label>
      </div>

      <div className="mt-4 space-y-2">
        <label htmlFor="full_name">Full Name</label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Full Name"
          defaultValue={user.full_name ?? ""}
          required
        />
        {state?.fullNameError && <InfoMessage type="error">{state.fullNameError}</InfoMessage>}
      </div>

      <SubmitButton text="Save" />

      {state?.errorMessage && <InfoMessage type="error">{state.errorMessage}</InfoMessage>}
      {state?.successMessage && <InfoMessage type="success">{state.successMessage}</InfoMessage>}
    </form>
  )
}
