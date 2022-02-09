import { useRouter } from "next/router"
import en from "../../../locales/en"
import pt from "../../../locales/pt"

type HeaderNavMenuType = {}

const HeaderNavMenu: React.FC<HeaderNavMenuType> = () => {
    const router = useRouter()
    const { locale } = router
    const t = locale === "en" ? en : pt

    return (
        <div className="flex items-center space-x-3"></div>
    )
}

export default HeaderNavMenu