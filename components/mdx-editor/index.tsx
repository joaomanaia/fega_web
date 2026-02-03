"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Columns2Icon, PanelRightCloseIcon, PanelRightOpenIcon, RowsIcon } from "lucide-react"
import { type ControllerRenderProps } from "react-hook-form"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { Hint } from "../hint"
import { Button } from "../ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import { ScrollArea } from "../ui/scroll-area"
import { Textarea } from "../ui/textarea"

interface MdxEditorProps {
  maxLength?: number
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, any>
}

const DynamicMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <p>Loading viewer...</p>,
})

type PreviewDirection = "horizontal" | "vertical"

export const MdxEditor: React.FC<MdxEditorProps> = ({ maxLength, className, field }) => {
  const [showPreview, setShowPreview] = useState<boolean>(true)
  const [previewDirection, setPreviewDirection] = useState<PreviewDirection>("horizontal")

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center">
        <h2 className="text-xl">Content Editor</h2>
        <Hint label="Toggle Preview">
          <Button
            className="text-surface-foreground ml-auto"
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
          >
            {showPreview ? <PanelRightCloseIcon /> : <PanelRightOpenIcon />}
          </Button>
        </Hint>
        <Hint label="Toggle Preview Direction">
          <Button
            className="text-surface-foreground ml-2"
            variant="ghost"
            size="icon"
            type="button"
            onClick={() =>
              setPreviewDirection((prev) => (prev === "horizontal" ? "vertical" : "horizontal"))
            }
          >
            {previewDirection === "horizontal" ? <Columns2Icon /> : <RowsIcon />}
          </Button>
        </Hint>
      </div>

      <ResizablePanelGroup className="mt-3 rounded-xl border" orientation={previewDirection}>
        <ResizablePanel>
          <Textarea
            className="bg-surface-variant/20 text-surface-variant-foreground h-full w-full resize-none rounded-none border-none p-4"
            placeholder="Type your content here..."
            maxLength={maxLength}
            {...field}
          />
        </ResizablePanel>
        {showPreview && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ScrollArea className="prose prose-invert h-full w-full p-4">
                <DynamicMarkdown remarkPlugins={[remarkGfm]}>
                  {field.value === "" ? "Nothing to preview" : field.value}
                </DynamicMarkdown>
              </ScrollArea>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}
