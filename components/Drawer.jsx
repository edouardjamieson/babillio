import gsap from "gsap";
import { HiOutlineChevronDown } from "react-icons/hi";

export default function Drawer({ children, toggleTitle, untoggleTitle }) {
    
    const handleToggleDrawer = (target) => {

        const container = target.closest('.drawer-container')
        const drawer = container.querySelector('.drawer-container_drawer')
        if(container.classList.contains('toggled')) {
            //Cacher
            gsap.to(drawer, { overflow:'hidden'})
            gsap.to(drawer, { height:0, duration:0.5 })
            container.classList.remove('toggled')
            container.querySelector('.drawer-container_toggle span').textContent = toggleTitle
        }else{
            //Afficher
            gsap.fromTo(drawer, { height:0 }, { height:"auto", duration:0.5 })
            gsap.to(drawer, { overflow:'visible', delay:0.5 })
            container.classList.add('toggled')
            container.querySelector('.drawer-container_toggle span').textContent = untoggleTitle
        }

    }
    
    return (
        <div className="drawer-container">
            <div className="drawer-container_toggle" onClick={(e) => handleToggleDrawer(e.target)}>
                <span>{toggleTitle}</span>
                <HiOutlineChevronDown />
            </div>
            <div className="drawer-container_drawer">
                <div className="drawer-container_drawer-container">
                    { children }
                </div>
            </div>
        </div>
    )
}
