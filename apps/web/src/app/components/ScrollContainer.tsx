import ScrollableFeed from "react-scrollable-feed"

interface ScrollContainerProps {
  className?: string
  children: React.ReactNode
}

const ScrollContainer: React.FC<ScrollContainerProps> = ({ className, children }) => {
  return <ScrollableFeed className={className}>{children}</ScrollableFeed>
}

export default ScrollContainer
