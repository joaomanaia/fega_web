import LoginContainer from "./components/LoginContainer"
import AuthContent from "./components/AuthContent"
import { redirect } from "next/navigation"
import { getLocalUser } from "@/utils/user-utils"

export const metadata = {
  title: "Login",
  description: "Login to use other features of the Fega app",
}

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  const localUser = await getLocalUser()
  if (localUser) return redirect("/")

  return (
    <LoginContainer>
      <AuthContent />
    </LoginContainer>
  )
}
