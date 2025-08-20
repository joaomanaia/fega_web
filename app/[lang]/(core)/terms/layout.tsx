export default function NewsLayout({ children }: LayoutProps<"/[lang]/terms">) {
  return (
    <section className="w-full overflow-y-auto">
      <article className="prose lg:prose-xl dark:prose-invert container">{children}</article>
    </section>
  )
}
