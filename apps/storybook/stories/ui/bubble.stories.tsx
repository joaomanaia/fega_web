import * as React from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@workspace/ui/components/bubble"
import { Button } from "@workspace/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { CheckIcon, ChevronDownIcon, InfoIcon } from "lucide-react"

const meta = {
  title: "Components/ui/Bubble",
  component: Bubble,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"],
      description: "The bubble visual treatment.",
    },
    align: {
      control: "select",
      options: ["start", "end"],
      description: "The inline alignment of the bubble.",
    },
  },
} satisfies Meta<typeof Bubble>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "default",
    align: "start",
  },
  render: (args) => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Bubble {...args}>
        <BubbleContent>I checked the registry output and removed the stale route.</BubbleContent>
        <BubbleReactions>
          <span>👍</span>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Bubble align="start" variant="secondary">
        <BubbleContent>Hello! How is the project going?</BubbleContent>
      </Bubble>
      <Bubble align="end" variant="default">
        <BubbleContent>Going great, just finishing up the bubble component!</BubbleContent>
      </Bubble>
    </div>
  ),
}

export const BubbleGrouping: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <BubbleGroup>
        <Bubble align="start" variant="secondary">
          <BubbleContent>Hey! Are you free for a quick call?</BubbleContent>
        </Bubble>
        <Bubble align="start" variant="secondary">
          <BubbleContent>Need to discuss the new design updates.</BubbleContent>
        </Bubble>
      </BubbleGroup>
      <BubbleGroup>
        <Bubble align="end" variant="default">
          <BubbleContent>Sure thing, give me 5 minutes.</BubbleContent>
        </Bubble>
        <Bubble align="end" variant="default">
          <BubbleContent>Joining now!</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  ),
}

export const LinksAndButtons: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Bubble variant="muted" align="start">
        <BubbleContent
          render={
            <button
              type="button"
              onClick={() => alert("Bubble button clicked!")}
              className="cursor-pointer"
            />
          }
        >
          Click here to accept the invitation
        </BubbleContent>
      </Bubble>
      <Bubble variant="outline" align="end">
        <BubbleContent
          render={<a href="#documentation" className="underline underline-offset-4" />}
        >
          View documentation ↗
        </BubbleContent>
      </Bubble>
    </div>
  ),
}

export const Reactions: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-12 py-6">
      <Bubble variant="muted" align="end">
        <BubbleContent>I don&apos;t need tests, I know my code works.</BubbleContent>
        <BubbleReactions
          side="bottom"
          align="start"
          role="img"
          aria-label="Reactions: thumbs up, surprised"
        >
          <span>👍</span>
          <span>😮</span>
        </BubbleReactions>
      </Bubble>

      <Bubble variant="muted" align="start">
        <BubbleContent>
          Bold. Fine I&apos;ll add some tests. I&apos;ll let you know when they&apos;re done.
        </BubbleContent>
        <BubbleReactions
          side="bottom"
          align="end"
          role="img"
          aria-label="Reactions: eyes, rocket, and 2 more"
        >
          <span>👀</span>
          <span>🚀</span>
          <span>+2</span>
        </BubbleReactions>
      </Bubble>

      <Bubble variant="default" align="end">
        <BubbleContent>Tests passed on the first try. All 142 of them. Looking good!</BubbleContent>
        <BubbleReactions
          side="top"
          align="start"
          role="img"
          aria-label="Reactions: party popper, clapping hands"
        >
          <span>🎉</span>
          <span>👏</span>
        </BubbleReactions>
      </Bubble>

      <Bubble variant="destructive" align="start">
        <BubbleContent>Are you sure I can run this command?</BubbleContent>
        <BubbleReactions side="bottom" align="end">
          <Button
            type="button"
            size="xs"
            variant="ghost"
            className="hover:bg-muted h-6 px-2.5 text-xs"
            onClick={() => alert("Command confirmed")}
          >
            Yes, run it
          </Button>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

export const ShowMoreCollapsible: Story = {
  render: function ShowMoreCollapsibleComponent() {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <div className="flex w-full max-w-sm flex-col gap-8 py-4">
        <Bubble variant="muted" align="start">
          <BubbleContent>How can I help you today?</BubbleContent>
        </Bubble>

        <Bubble variant="muted" align="end">
          <BubbleContent className="whitespace-pre-line">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <div>
                The accessibility review found two focus states that were visually too subtle in
                dark mode.
                {"\n\n"}I checked the dialog, menu, and drawer paths because each one renders
                focusable controls...
              </div>

              <CollapsibleContent className="mt-2 space-y-2">
                <div>
                  Because each one renders focusable controls inside a portal, we need to ensure
                  contrast ratios meet WCAG 2.1 AA standards across all active and focused states.
                </div>
              </CollapsibleContent>

              <CollapsibleTrigger className="text-muted-foreground mt-2 inline-flex cursor-pointer items-center gap-1 p-0 text-xs font-medium underline-offset-4 hover:underline">
                <span>{isOpen ? "Show less" : "Show more"}</span>
                <ChevronDownIcon
                  className={cn("size-3 transition-transform duration-200", isOpen && "rotate-180")}
                />
              </CollapsibleTrigger>
            </Collapsible>
          </BubbleContent>
        </Bubble>
      </div>
    )
  },
}

export const WithTooltip: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-6 py-4">
      <Bubble variant="secondary" align="start">
        <BubbleContent>Did you remove the stale route?</BubbleContent>
      </Bubble>

      <Bubble variant="default" align="end">
        <BubbleContent>Yes, removed it from the registry.</BubbleContent>
        <BubbleReactions side="bottom" align="end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-foreground size-6"
                    aria-label="Delivery status"
                  />
                }
              >
                <CheckIcon />
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end">
                Read today at 2:15 PM
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </BubbleReactions>
      </Bubble>
    </div>
  ),
}

export const WithPopover: Story = {
  render: () => (
    <div className="flex w-full max-w-sm flex-col gap-6 py-4">
      <Bubble variant="destructive" align="start">
        <BubbleContent className="flex items-center gap-2">
          <span>Failed to run the command.</span>
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-destructive hover:bg-destructive/20 size-5 p-0"
                  aria-label="More error info"
                />
              }
            >
              <InfoIcon className="size-3.5" />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 text-xs">
              <div className="text-foreground font-semibold">Command Error Output</div>
              <pre className="bg-muted mt-1 overflow-x-auto rounded-md p-2 text-[11px] leading-snug">
                {`Error: Command failed with exit code 1: bun run build\nModule not found: Can't resolve './missing-file'`}
              </pre>
            </PopoverContent>
          </Popover>
        </BubbleContent>
      </Bubble>
      <Bubble variant="muted" align="end">
        <BubbleContent>Run the build script again with --verbose.</BubbleContent>
      </Bubble>
    </div>
  ),
}
