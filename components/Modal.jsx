import { HiOutlineX } from "react-icons/hi";

export default function Modal({ children, title, description, visible, id, onExit }) {
    return (
        <div className={visible ? 'main-modal' : 'main-modal main-modal_hidden'} id={id}>
            <div className="main-modal_back" onClick={() => onExit()}></div>
            <div className="main-modal_content-container">
                <div className="main-modal_content-head">
                    <h2>{ title }</h2>
                    <button className="main-modal_exit" onClick={() => onExit()}>
                        <HiOutlineX />
                    </button>
                </div>
                <p>{ description }</p>
                <div className="main-modal_content">
                    { children }
                </div>
            </div>
        </div>
    )
}
