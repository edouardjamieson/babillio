import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

import { HiOutlineDocumentText, HiOutlineUsers, HiOutlineBeaker, HiOutlineChat, HiOutlineSearch, HiOutlineCurrencyDollar, HiOutlinePencil, HiOutlineCog, HiOutlineLogout, HiOutlineNewspaper, HiOutlineCalendar, HiOutlinePencilAlt, HiOutlinePaperClip } from 'react-icons/hi'
import { useRouter } from 'next/dist/client/router'

export default function Header({ navigationVisible, currentPage, user, course }) {

    const actionsMenu = useRef()
    const actionsMenuTrigger = useRef(null)

    const router = useRouter()

    useEffect(() => {

        if(actionsMenuTrigger.current !== null) {
            actionsMenuTrigger.current.addEventListener('click', handleActionMenuToggle)
        }
        
        return () => {
            if(actionsMenuTrigger.current !== null) {
                actionsMenuTrigger.current.removeEventListener('click', handleActionMenuToggle)
            }
        }
        
    }, [])

    const handleActionMenuToggle = () => {
        if(actionsMenu.current.classList.contains('hidden')) {
            gsap.fromTo(actionsMenu.current, { height:0 }, { height:'auto', duration:0.5, ease:"Expo.easeOut" })
            actionsMenu.current.classList.remove('hidden')
        }else{
            gsap.to(actionsMenu.current, { height:0, duration:0.5, ease:"Expo.easeOut", onComplete:() => { actionsMenu.current.classList.add('hidden') } })
        }
    }

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
                <Link href={navigationVisible ? "/app" : "/app/account/setup"}>
                    <a className="main-header_logo"></a>
                </Link>
            </div>

            <nav className="main-header_navigation">
                { navigationVisible ?
                <ul>
                    <li>
                        <Link href="/app/schedule">
                            <a className={currentPage === 'schedule' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlineCalendar />
                                <span>Calendrier</span>
                                <span className="label">Calendrier</span>
                            </a>
                        </Link>
                    </li>
                    { user.data().type === "teacher" ?
                    <li>
                        <Link href="/app/students">
                            <a className={currentPage === 'students' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlineUsers />
                                <span>Élèves</span>
                                <span className="label">Élèves</span>
                            </a>
                        </Link>
                    </li> : null }
                    <li>
                        <Link href="/app/content">
                            <a className={currentPage === 'content' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlinePaperClip />
                                <span>Matériel</span>
                                <span className="label">Matériel</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/app/homework">
                            <a className={currentPage === 'homework' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlinePencilAlt />
                                <span>Travaux</span>
                                <span className="label">Travaux</span>
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/app/inbox">
                            <a className={currentPage === 'inbox' ? "main-header_navigation-item current-page" : "main-header_navigation-item"}>
                                <HiOutlineChat />
                                <span>Messages</span>
                                <span className="label">Messages</span>
                                <i className="notification-dot"></i>
                            </a>
                        </Link>
                    </li>
                </ul> : null }
            </nav>

            <div className="main-header_actions-container">
                <div className="main-header_actions">
                    {navigationVisible ?
                    <button className="main-header_search-button">
                        <HiOutlineSearch />
                    </button> : null }

                    {navigationVisible && course ?
                        <button className="main-header_course-button" onClick={() => router.push(`/app/select?gobackto=${router.asPath}`)}>
                            <i>{course.course.data.icon}</i>
                            <div>
                                <h4>{}</h4>
                                <h4>{course.course.data.name.length >= 15 ? course.course.data.name.substring(0, 15) + "..." : course.course.data.name}</h4>
                                <span>gr. {course.group.data.name}</span>
                            </div>
                        </button>
                    : null}

                    {navigationVisible && user ?
                    <button ref={actionsMenuTrigger} className="main-header_profile-button" style={{ backgroundImage: `url(${user.data().profile_picture})` }}></button> : null}
                </div>
            </div>

            <div ref={actionsMenu} className="main-header_actions-menu hidden">
                <Link href="/app/account">
                    <a className="main-header_actions-profile">
                        <strong>{user.data().name}</strong>
                        <FormatedType/>
                    </a>
                </Link>
                <Link href="/app/account/payments">
                    <a className="main-header_action-item">
                        <HiOutlineCurrencyDollar />
                        <span>Paiements</span>
                    </a>
                </Link>
                <Link href="/app/account/edit">
                    <a className="main-header_action-item">
                        <HiOutlinePencil />
                        <span>Modifier le profil</span>
                    </a>
                </Link>
                <Link href="/app/settings">
                    <a className="main-header_action-item">
                        <HiOutlineCog />
                        <span>Paramètres</span>
                    </a>
                </Link>
                <Link href="/app/account/logout">
                    <a className="main-header_action-item">
                        <HiOutlineLogout />
                        <span>Déconnexion</span>
                    </a>
                </Link>
            </div>

            



        </header>
    )
}
