export default function SuccessAlert({ visible, content, onClick }) {
    return (
        <div onClick={() => onClick()} className={visible === false ? "success-container success-container_hidden" : "success-container"}>
            { content }
        </div>
    )
}
