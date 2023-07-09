import LoginContainer from "./components/LoginContainer"
import LoginContent from "./components/LoginContent"

export const metadata = {
  title: "Login",
  description: "Login to use other features of the Fega app",
}

export default function LoginPage() {
  return (
    <LoginContainer>
     <LoginContent />
    </LoginContainer>
  )
}
