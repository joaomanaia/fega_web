"use server"

import * as z from "zod"

const schema = z.object({
  full_name: z.string().min(3).max(30),
  // avatar_url: z.string().url(),
})

export default async function saveProfile(formData: FormData) {
  try {
    const parsed = schema.parse({
      full_name: formData.get("full_name"),
      // avatar_url: formData.get("avatar_url"),
    })

    console.log("Full Name", parsed.full_name)
    // console.log("Avatar URL", parsed.avatar_url)
  } catch (err) {
    console.log("Error saving profile", err)
    return {
      message: `Error saving profile: ${err}`,
    }
  }
}
