"use client"

import { ArrowUpwardRounded, ArrowDownwardRounded } from "@mui/icons-material"
import { Typography } from "@mui/material"
import { twMerge } from "tailwind-merge"

interface VoteButtonProps {
  postId: string
  className?: string
}

const ScoreButton: React.FC<VoteButtonProps> = ({ postId, className }) => {
  return (
    <div className={twMerge("space-x-4 flex items-center justify-center", className)}>
      <ArrowUpwardRounded />
      <Typography variant="subtitle1">1</Typography>
      <ArrowDownwardRounded />
    </div>
  )
}

export default ScoreButton
