export default function NewsLayout({ children }: LayoutProps<"/[lang]/news">) {
  return (
    <section className="w-full overflow-y-scroll">
      <article className="prose lg:prose-xl dark:prose-invert container">{children}</article>
    </section>
  )
}
