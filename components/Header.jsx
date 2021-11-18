import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

import { HiOutlineDocumentText, HiOutlineUsers, HiOutlineBeaker, HiOutlineChat, HiOutlineSearch, HiOutlineCurrencyDollar, HiOutlinePencil, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi'

export default function Header({ navigationVisible, currentPage, isLoading, user }) {

    const actionsMenu = useRef()
    const actionsMenuTrigger = useRef()
    useEffect(() => {

        actionsMenuTrigger.current.addEventListener('click', () => {
            if(actionsMenu.current.classList.contains('hidden')) {
                gsap.fromTo(actionsMenu.current, { height:0 }, { height:'auto', duration:0.5, ease:"Expo.easeOut" })
                actionsMenu.current.classList.remove('hidden')
            }else{
                gsap.to(actionsMenu.current, { height:0, duration:0.5, ease:"Expo.easeOut", onComplete:() => { actionsMenu.current.classList.add('hidden') } })
            }
        })
        
    }, [])

    const FormatedType = () => {

        const type = user.data().type
        const gender = user.data().gender

        let formated
        if(type === "student" && gender === "male") formated = "Étudiant"
        if(type === "student" && gender === "female") formated = "Étudiante"
        if(type === "student" && gender === "other") formated = "Étudiant(e)"
        if(type === "teacher" && gender === "male") formated = "Enseignant"
        if(type === "teacher" && gender === "female") formated = "Enseignante"
        if(type === "teacher" && gender === "other") formated = "Enseignant(e)"
        return <span>{formated}</span>

    }

    return (
        <header className="main-header">

            <div className="main-header_logo-container">
                <Link href="/">
                    <a className="main-header_logo"></a>
                </Link>
            </div>

            <nav className="main-header_navigation">
                { navigationVisible ?
                <ul>
                    <li>
                        <Link href="/documents">
                            <a className={currentPage === 'documents' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlineDocumentText />
                                <span>Documents</span>
                                <span className="label">Documents</span>
                            </a>
                        </Link>
                    </li>
                    { user.data().type === "teacher" ?
                    <li>
                        <Link href="/students">
                            <a className={currentPage === 'students' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlineUsers />
                                <span>Élèves</span>
                                <span className="label">Élèves</span>
                            </a>
                        </Link>
                    </li> : null }
                    <li>
                        <Link href="/homework">
                            <a className={currentPage === 'homework' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlineBeaker />
                                <span>Travaux</span>
                                <span className="label">Travaux</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/inbox">
                            <a className={currentPage === 'inbox' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlineChat />
                                <span>Messages</span>
                                <span className="label">Messages</span>
                            </a>
                        </Link>
                    </li>
                </ul> : null }
            </nav>

            <div className="main-header_actions-container">
                { navigationVisible ?
                <ul className="main-header_actions">
                    <button className="main-header_search-button">
                        <HiOutlineSearch />
                    </button>
                    <button ref={actionsMenuTrigger} className="main-header_profile-button" style={{ backgroundImage: `url(${user.data().profile_picture})` }}></button>
                </ul> : null }
            </div>

            <div ref={actionsMenu} className="main-header_actions-menu hidden">
                <Link href="/account">
                    <a className="main-header_actions-profile">
                        <strong>{user.data().name}</strong>
                        <FormatedType/>
                    </a>
                </Link>
                <Link href="/account/payments">
                    <a className="main-header_action-item">
                        <HiOutlineCurrencyDollar />
                        <span>Paiements</span>
                    </a>
                </Link>
                <Link href="/account/edit">
                    <a className="main-header_action-item">
                        <HiOutlinePencil />
                        <span>Modifier le profil</span>
                    </a>
                </Link>
                <Link href="/settings">
                    <a className="main-header_action-item">
                        <HiOutlineCog />
                        <span>Paramètres</span>
                    </a>
                </Link>
                <Link href="/account/logout">
                    <a className="main-header_action-item">
                        <HiOutlineLogout />
                        <span>Déconnexion</span>
                    </a>
                </Link>
            </div>

            



        </header>
    )
}
