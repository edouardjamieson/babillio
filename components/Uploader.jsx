import { useEffect, useRef } from "react"

export default function Uploader({ onDrop, inputId }) {

    const dropzone = useRef(null)

    useEffect(() => {

        window.addEventListener("dragover", cancelDrop)
        dropzone.current.addEventListener("drop", handleDrop)

        return () => {
            window.removeEventListener("dragover", cancelDrop)
        }
    }, [])

    const cancelDrop = (e) => {
        e.preventDefault()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const files = e.dataTransfer.items
        const transfered = []
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if(file.kind === 'file') {
                transfered.push(file.getAsFile())
            }
            
        }

        onDrop(transfered)
    }

    return (
        <div className="uploader-container">
            <label htmlFor={inputId} className="uploader-container_label" ref={dropzone}>
                Glissez & déposez des fichiers ici ou cliquez ici pour en sélectionner.
            </label>
        </div>
    )
}
