import { IconType } from "../IconType"

interface FilledButtonProps {
    text: string
    Icon?: IconType
    disabled?: boolean
    onClick: () => void
}

const FilledButton: React.FC<FilledButtonProps> = ({text, Icon, disabled, onClick}) => {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center justify-center cursor-pointer h-10 px-6 rounded-full ${Icon && "pl-4"} ${disabled ? "cursor-not-allowed bg-onSurface-light12 dark:bg-onSurface-dark12" : "bg-primary-light dark:bg-primary-dark hover:bg-primary-light12 dark:hover:bg-primary-dark12"}`}>
            {Icon && <Icon className="w-[18px] h-[18px]" />}

            <p className={`text-lg ${disabled ? "text-onSurface-light38 dark:text-onSurface-dark38" : "text-onPrimary-light dark:text-onPrimary-dark"}`}>
                {text}
            </p>
        </button>
    )
}

export default FilledButton