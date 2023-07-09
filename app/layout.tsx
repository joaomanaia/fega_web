import "../styles/globals.css"
import "../styles/firebaseui-styling.global.css"
import M3 from "@/core/theme/M3"
import MainLayout from "@/components/m3/MainLayout"
import MainContainer from "@/components/m3/MainContainer"

/*
export const metadata = {
  title: 'Fega',
  description: 'The best social network in ega!',
}
*/

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <M3>
          <MainLayout>
            <MainContainer>
              {children}
            </MainContainer>
          </MainLayout>
        </M3>
      </body>
    </html>
  )
}
