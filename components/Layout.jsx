import Head from 'next/head'
import gsap from 'gsap'
import { useRouter } from 'next/dist/client/router'
import { getAuth, getLoggedUser, getUserByID } from '../functions/user.db'
import { useState, useEffect } from 'react'

import Loader from './Loader'
import Header from './Header'
import { getCurrentCourse } from '../functions/course.db'
import { auth } from '../functions/firebase'

export default function Layout({ children, pageTitle, navigationVisible, currentPage, id, requiresCourse, onGetGroupInfos }) {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [course, setCourse] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(!user) {
                router.push('/app/account/login')
            }else{
                getUserByID(user.uid)
                .then(u => {
                    setCurrentUser(u)   
                    
                    if(requiresCourse === true) {
                        getCurrentCourse(u.id)
                        .then(c => {
                            if(c !== null) { 
                                setCourse(c)
                                onGetGroupInfos(c)
                                setIsLoading(false)
                            }else{
                                if(router.route !== '/app/select') {
                                    router.push(`/app/select?gobackto=${router.asPath}`)
                                }
                                setIsLoading(false)
                            }

                        })
                    }else{
                        setIsLoading(false)
                    }
        
        
                })
            }
        })

    }, [])

    return (
        <>
            <Head>
                <title>Babillio - {pageTitle}</title>
                <meta name="description" content="Babillio - L'application pour les enseignants et éléves qui révolutionne les cours." />
                <link rel="icon" href="/images/logo_blue.png"/>
            </Head>

            { isLoading !== true && currentUser !== null ?
            <>
                <Header
                    navigationVisible={navigationVisible}
                    currentPage={currentPage}
                    user={currentUser}
                    course={course}
                />
                <main className="main-content" id={id}>
                    <div className="wrapper">
                        {children}
                    </div>
                </main>
            </> : <Loader/>
            }
        </>
    )
}
