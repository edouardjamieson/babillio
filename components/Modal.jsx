export default function Modal({ children, title, description, visible, id }) {
    return (
        <div className={visible ? 'main-modal' : 'main-modal main-modal_hidden'} id={id}>
            <div className="main-modal_content-container">
                <h2>{ title }</h2>
                <p>{ description }</p>
                <div className="main-modal_content">
                    { children }
                </div>
            </div>
        </div>
    )
}
