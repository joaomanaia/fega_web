type HeaderNavButtonType = {
    Icon: any
    selected: boolean
}

const HeaderNavButton: React.FC<HeaderNavButtonType> = ({Icon, selected}) => {
    return(
        <div className={`rounded-2xl w-14 h-14 ${selected ? 'bg-red-400 dark:bg-red-700 hover:bg-red-600' : 'dark:bg-gray-800 hover:bg-red-600 dark:hover:bg-gray-700'}`}>
            <div className='w-14 h-14 text-white p-4 rounded-2xl mr-4'>
                <Icon/>
            </div>
        </div>
    )
}

export default HeaderNavButton