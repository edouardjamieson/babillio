export default function ErrorAlert({ visible, content, onClick }) {
    return (
        <div onClick={() => onClick()} className={visible === false ? "error-container error-container_hidden" : "error-container"}>
            { content }
        </div>
    )
}
