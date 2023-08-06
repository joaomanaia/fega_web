"use client"

import { Card, Button, CardActions, CardContent, CardMedia, ListItem, Typography } from "@mui/material"

import Image from "next/image"

export type NewsItemType = {
  id: string
  title: string
  description: string
  mainImage: string
}

const NewsItem: React.FC<NewsItemType> = ({ title, description, mainImage }) => {
  return (
    <ListItem
      disablePadding
      itemScope
      itemType="https://schema.org/NewsArticle"
      className="relative group rounded-2xl aspect-video w-full"
    >
      <meta itemProp="author" content="João Manaia" />

      <Card 
        variant="elevation"
        sx={{ width: "100%", height: "auto", position: "relative" }}>
        <CardMedia>
          <meta itemProp="image" content={mainImage} />

          <div className="relative w-full aspect-video">
            <Image className="rounded-2xl" src={mainImage} layout="fill" objectFit="cover" alt={title} />
          </div>
        </CardMedia>

        <CardContent>
          <Typography itemProp="headline" variant="h4" gutterBottom>
            {title}
          </Typography>

          <Typography
            itemProp="articleBody"
            variant="subtitle1"
            fontSize="1.2rem">
            {description}
          </Typography>
        </CardContent>

        <CardActions>
            <Button variant="filled">Mais informações</Button>
        </CardActions>
      </Card>
    </ListItem>
  )
}

export default NewsItem
