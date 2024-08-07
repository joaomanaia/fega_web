"use client"

import { cn } from "@/lib/utils"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import { useState } from "react"
import dynamic from "next/dynamic"
import { ScrollArea } from "../ui/scroll-area"
import { Button } from "../ui/button"
import { Columns2Icon, PanelRightCloseIcon, PanelRightOpenIcon, RowsIcon } from "lucide-react"
import { Hint } from "../hint"
import { Textarea } from "../ui/textarea"
import { type ControllerRenderProps } from "react-hook-form"
import remarkGfm from "remark-gfm"

interface MdxEditorProps {
  maxLength?: number
  className?: string
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
            className="ml-auto text-surface-foreground"
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
            className="ml-2 text-surface-foreground"
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

      <ResizablePanelGroup
        className="rounded-xl border border-outline/30 mt-3"
        direction={previewDirection}
      >
        <ResizablePanel>
          <Textarea
            className="w-full h-full resize-none p-4 border-none rounded-none bg-surfaceVariant/20 text-surfaceVariant-foreground"
            placeholder="Type your content here..."
            maxLength={maxLength}
            {...field}
          />
        </ResizablePanel>
        {showPreview && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ScrollArea className="h-full w-full">
                <DynamicMarkdown 
                  remarkPlugins={[remarkGfm]}
                  className="h-full w-full prose prose-invert p-4">
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
