export default function SocialAuthSeparator({ separatorText }: { separatorText: string }) {
  return (
    <div className="relative w-full text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-outline-variant">
      <span className="relative z-10 bg-background px-2 text-foreground/60">{separatorText}</span>
    </div>
  )
}
