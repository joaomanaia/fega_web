import { Button } from "@mui/material"

export default function Page() {
    return (
        <div>
            <h1>Page</h1>

            <div className="flex items-center justify-center">
                <Button2 />
                <Button2 />
                <Button2 />
            </div>
        </div>
    )
}

const Button2: React.FC = () => {
    return (
        <Button variant="filled" className="rounded-none first:rounded-l-full last:rounded-r-full">1</Button>
    )
}