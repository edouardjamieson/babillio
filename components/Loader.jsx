import { useEffect, useState } from "react"
export default function Loader() {

    const openning = [
        "Ouverture des casiers...",
        "Débarrage des cadenas...",
        "Éguisage des crayons...",
        "Sonnage de la cloche...",
        "Ouverture du sac à dos...",
        "Ouverture de l'étuie à crayons...",
    ]

    const [open, setOpen] = useState(null)

    useEffect(() => {
        setOpen(Math.floor(Math.random() * openning.length))
    }, [])


    return (
        <div className="large-loader">
            <img src="/images/loading.svg" alt="loading..." />
            {
                open ? <span>{openning[open]}</span> : null
            }
        </div>
    )
}
