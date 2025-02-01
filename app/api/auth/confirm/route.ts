import { createClient } from "@/lib/supabase/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next

  console.log({ token_hash, type, next })

  if (token_hash && type) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    console.log("VERIFY OTP", { data, error })
    if (!error) {
      // redirect user to specified redirect URL or root of app

      return NextResponse.redirect(redirectTo)
    }
  }

  // TODO: handle error
  // redirect the user to an error page with some instructions
  redirectTo.pathname = "/auth/auth-code-error"
  return NextResponse.redirect(redirectTo)
}
