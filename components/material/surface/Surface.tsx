interface SurfaceProps {
    children: React.ReactNode
    className?: string
    elevation?: number
    shadowDisabled?: boolean
    onClick?: () => void
}

const primaryElevationColor = (elevation: number): string => {
    if (elevation == 1) {
        return "bg-primary-light/5 dark:bg-primary-dark/5"
    } else if (elevation == 2) {
        return "bg-primary-light/10 dark:bg-primary-dark/10"
    } else if (elevation == 3) {
        return "bg-primary-light/20 dark:bg-primary-dark/20"
    } else if (elevation == 4) {
        return "bg-primary-light/25 dark:bg-primary-dark/25"
    } else if (elevation == 5) {
        return "bg-primary-light/30 dark:bg-primary-dark/30"
    } else {
        return "bg-surface-light dark:bg-surface-dark"
    }
}

const hoverPrimaryElevationColor = (elevation: number): string => {
    if (elevation == 1) {
        return "hover:bg-primary-light/5 dark:hover:bg-primary-dark/5"
    } else if (elevation == 2) {
        return "hover:bg-primary-light/10 dark:hover:bg-primary-dark/10"
    } else if (elevation == 3) {
        return "hover:bg-primary-light/20 dark:hover:bg-primary-dark/20"
    } else if (elevation == 4) {
        return "hover:bg-primary-light/25 dark:hover:bg-primary-dark/25"
    } else if (elevation == 5) {
        return "hover:bg-primary-light/30 dark:hover:bg-primary-dark/30"
    } else {
        return "hover:bg-surface-light dark:hover:bg-surface-dark"
    }
}

const Surface: React.FC<SurfaceProps> = ({children, className, elevation, shadowDisabled, onClick}) => {
    return (
        <div 
            onClick={onClick}
            className={`${className} ${!shadowDisabled && "shadow-md"} 
                ${elevation && primaryElevationColor(elevation)} text-onSurface-light dark:text-onSurface-dark 
                ${onClick && hoverPrimaryElevationColor(2)}`}>
            {children}
        </div>
    )
}

export default Surface