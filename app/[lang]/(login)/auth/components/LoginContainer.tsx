import { type Dictionary } from "@/get-dictionary"

interface LoginContainerProps {
  children: React.ReactNode
  authDictionary: Dictionary["page"]["auth"]
}

export const LoginContainer: React.FC<LoginContainerProps> = ({ children, authDictionary }) => {
  return (
    <div className="h-screen w-screen bg-primary text-primary-foreground flex flex-col lg:flex-row items-center justify-center">
      <div className="grow lg:h-full w-full lg:w-1/2 flex flex-col items-center justify-center">
        <h2 className="text-3xl lg:text-4xl xl:text-6xl">{authDictionary.header}</h2>

        <p className="text-lg lg:text-xl mt-0">{authDictionary.subheader}</p>
      </div>

      <main className="h-5/6 lg:h-full w-full lg:w-1/2 bg-background text-foreground rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl flex flex-col items-center justify-center">
        <h2 className="text-3xl lg:text-4xl xl:text-6xl">{authDictionary.signin}</h2>
        {children}
      </main>
    </div>
  )
}
