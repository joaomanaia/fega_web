import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

Deno.serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  )

  // Get the session or user object
  const authHeader = req.headers.get("Authorization")!
  const token = authHeader.replace("Bearer ", "")
  const {
    data: { user },
  } = await supabaseClient.auth.getUser(token)

  if (!user) {
    throw new Error("User not found")
  }

  const { error } = await supabaseClient.auth.admin.deleteUser(user.id)

  if (error) {
    throw new Error(error.message)
  }

  return new Response(JSON.stringify({ message: "User deleted" }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  })
})
