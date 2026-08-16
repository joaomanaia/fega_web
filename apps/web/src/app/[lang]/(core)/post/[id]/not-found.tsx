import { useTranslations } from "next-intl"
import { BaseNotFound } from "@/app/components/base-not-found"

export default function PostNotFound() {
  const t = useTranslations("Post.notFound")

  return <BaseNotFound title={t("header")} description={t("description")} />
}
