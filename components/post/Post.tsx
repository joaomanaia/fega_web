import useSWR from "swr"
import Image from "next/image"
import { useState } from "react"
import { auth, firestore } from "../../firebase"
import { deleteDoc, doc } from "firebase/firestore"
import { PostType } from "./Posts"
import { fetcher } from "../../utils/data"
import { defaultImgUrl } from "../../utils/common"
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"
import { DeleteRounded, MoreVertRounded, ShareRounded } from "@mui/icons-material"

type PostParams = {
  post: PostType
  userIsAdmin: boolean
  onPostDeleted: (post: PostType) => void
}

type User = {
  name: string
  photoUrl: string
  uid: string
}

const Post: React.FC<PostParams> = ({ post, userIsAdmin, onPostDeleted }) => {
  const { data } = useSWR(`/api/user/getUserByUid?uid=${post.uid}`, fetcher)

  const user: User = data !== undefined ? JSON.parse(data.user) : {}

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const { palette } = useTheme()

  const deletePost = async () => {
    handleClose()
    await deleteDoc(doc(firestore, "publications", post.id))
    onPostDeleted(post)
  }

  const sharePost = () => {
    handleClose()
    const shareLink = `https://fega.ml/post/${post.id}`
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <ListItem
      itemScope
      itemType="https://schema.org/SocialMediaPosting"
      itemID={`https://www.fega.ml/post/${post.id}`}
      className="flex flex-col w-full"
      disablePadding
    >
      <meta itemProp="datePublished" content={post.timestamp} />

      <Card variant="elevation" sx={{ width: "100%" }}>
        <CardHeader
          itemProp="author"
          itemScope
          itemType="https://schema.org/Person"
          avatar={
            <Avatar
              src={user?.photoUrl}
              alt={user?.name}
              aria-label="image"
              sx={{
                background: palette.secondary.main,
                color: palette.onSecondary.main,
              }}
            >
              {user?.name}
            </Avatar>
          }
          title={user.name}
          subheader={post.timestamp}
          action={
            <Tooltip title="Settings">
              <IconButton
                id="settings-button"
                aria-controls={open ? "settings-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                aria-label="settings"
              >
                <MoreVertRounded />
              </IconButton>
            </Tooltip>
          }
        >
          <meta itemProp="image" content={user?.photoUrl || defaultImgUrl} />
          <meta itemProp="url" content={`https://www.fega.ml/${user?.uid}`} />
          <meta itemProp="name" content={user?.name} />
        </CardHeader>

        <CardContent>
          <Typography itemProp="headline" variant="h5">
            {post.data.description}
          </Typography>
        </CardContent>

        <CardMedia className="flex gap-2">
          {post.data.images?.map((image) => (
            <div
              key={image}
              className={`relative mt-4 ${
                post.data.images.length == 1 ? "aspect-video w-full" : "aspect-square w-1/2"
              }`}
            >
              <meta itemProp="image" content={image} />
              <Image
                itemProp="image"
                src={image}
                layout="fill"
                className="rounded-2xl"
                alt="Publication Image"
                objectFit="cover"
              />
            </div>
          ))}
        </CardMedia>
      </Card>

      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "settings-button",
        }}
      >
        <MenuItem onClick={sharePost}>
          <ListItemIcon>
            <ShareRounded fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>

        {auth.currentUser?.uid === post.uid || userIsAdmin && (
          <MenuItem onClick={deletePost}>
            <ListItemIcon>
              <DeleteRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </ListItem>
  )
}

export default Post

/**
 * <PostDropDownMenu
          isUserAdmin={auth.currentUser?.uid === post.uid || userIsAdmin}
          post={post}
          onDeleteClick={deletePost}
        />
 */
