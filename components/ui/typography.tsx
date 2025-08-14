import * as React from "react"

import { cn } from "@/lib/utils"

const H1 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h1">>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
      {...props}
    />
  )
)

H1.displayName = "H1"

const H2 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h2">>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "mt-10 scroll-m-20 border-b border-b-slate-200 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 dark:border-b-slate-700",
        className
      )}
      {...props}
    />
  )
)

H2.displayName = "H2"

const H3 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h3">>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
)

H3.displayName = "H3"

const H4 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<"h4">>(
  ({ className, ...props }, ref) => (
    <h4
      ref={ref}
      className={cn("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  )
)

H4.displayName = "H4"

const P = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("leading-7 not-first:mt-6", className)} {...props} />
  )
)

P.displayName = "P"

const BlockQuote = React.forwardRef<HTMLQuoteElement, React.ComponentPropsWithoutRef<"blockquote">>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        "mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200",
        className
      )}
      {...props}
    />
  )
)

BlockQuote.displayName = "BlockQuote"

const Table = React.forwardRef<HTMLTableElement, React.ComponentPropsWithoutRef<"table">>(
  ({ className, ...props }, ref) => (
    <table ref={ref} className={cn("w-full", className)} {...props} />
  )
)

Table.displayName = "Table"

const THead = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"thead">>(
  ({ className, ...props }, ref) => <thead ref={ref} className={cn("", className)} {...props} />
)

THead.displayName = "THead"

const TBody = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"tbody">>(
  ({ className, ...props }, ref) => <tbody ref={ref} className={cn("", className)} {...props} />
)

TBody.displayName = "TBody"

const TR = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<"tr">>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "m-0 border-t border-slate-300 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800",
        className
      )}
      {...props}
    />
  )
)

TR.displayName = "TR"

const TD = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"td">>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  )
)

TD.displayName = "TD"

const TH = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"th">>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  )
)

TH.displayName = "TH"

const UL = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
  )
)

UL.displayName = "UL"

const LI = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
)

LI.displayName = "LI"

const InlineCode = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"code">>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        "relative rounded bg-slate-100 py-[0.2rem] px-[0.3rem] font-mono text-sm font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-400",
        className
      )}
      {...props}
    />
  )
)

InlineCode.displayName = "InlineCode"

const Lead = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xl text-slate-700 dark:text-slate-400", className)}
      {...props}
    />
  )
)

Lead.displayName = "Lead"

const Large = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-lg font-semibold text-slate-900 dark:text-slate-50", className)}
      {...props}
    />
  )
)

Large.displayName = "Large"

const Small = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"small">>(
  ({ className, ...props }, ref) => (
    <small ref={ref} className={cn("text-sm font-medium leading-none", className)} {...props} />
  )
)

Small.displayName = "Small"

const Subtle = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  )
)

Subtle.displayName = "Subtle"

export {
  H1,
  H2,
  H3,
  H4,
  P,
  BlockQuote,
  Table,
  THead,
  TBody,
  TR,
  TD,
  TH,
  UL,
  LI,
  InlineCode,
  Lead,
  Large,
  Small,
  Subtle,
}
