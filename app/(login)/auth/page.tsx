import LoginContainer from "./components/LoginContainer"
import AuthContent from "./components/AuthContent"

export const metadata = {
  title: "Login",
  description: "Login to use other features of the Fega app",
}

export default function LoginPage() {
  return (
    <LoginContainer>
      <AuthContent />
    </LoginContainer>
  )
}
