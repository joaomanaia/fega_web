export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full overflow-y-scroll">
      <article className="container prose lg:prose-xl dark:prose-invert">{children}</article>
    </section>
  )
}
