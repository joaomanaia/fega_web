import { Button, TextField, Typography } from "@mui/material"
import { Metadata } from "next"
import BackButton from "./components/BackButton"
import MainContainer from "../../components/m3/MainContainer"
import { createServerActionClient } from "@/supabase"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const metadata: Metadata = {
  title: "Create group",
  description: "Create a new group",
}

export default async function CreateGroupPage() {

  const createGroup = async (formData: FormData) => {
    "use server"

    const name = formData.get("group-name")?.toString()
    if (!name) return

    const supabase = createServerActionClient()

    const { error } = await supabase.from("groups").insert({ name: name })

    if (error) {
      console.error(error)
      return
    }

    revalidatePath("/groups")
    redirect("/groups")
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
