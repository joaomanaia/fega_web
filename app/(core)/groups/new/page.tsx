import MainContainer from "@/components/m3/MainContainer"
import Avatar from "@/components/m3/avatar"
import { Box, Button, TextField, Typography } from "@mui/material"
import { Metadata } from "next"
import BackButton from "./components/BackButton"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Create group",
  description: "Create a new group",
}

export default async function CreateGroupPage() {

  const createGroup = async (formData: FormData) => {
    "use server"

    const name = formData.get("group-name")?.toString()
    if (!name) return

    const supabase = createServerActionClient({ cookies })

    const { error } = await supabase.from("groups").insert({ name: name })

    if (error) {
      console.error(error)
      return
    }
  }

  return (
    <MainContainer className="w-full h-auto flex flex-col items-center xl:w-4/6">
      <Typography variant="h4">Create a Group</Typography>

      <form className="flex flex-col mt-8 w-full" action={createGroup}>
        <TextField
          autoFocus
          required
          margin="dense"
          name="group-name"
          label="Group name"
          type="text"
          fullWidth
          variant="outlined"
          sx={{ marginBottom: 1 }}
        />

        <div className="flex self-end space-x-4">
          <BackButton />
          <Button variant="filled" type="submit">Create</Button>
        </div>
      </form>
    </MainContainer>
  )
}
