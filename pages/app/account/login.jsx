import Head from 'next/head'
import Link from 'next/link'
import Loader from '/components/Loader'
import { HiOutlineAtSymbol, HiOutlineLockClosed } from 'react-icons/hi'

import { useRouter } from 'next/dist/client/router'
import { useState, useEffect, useRef } from 'react'

import { auth, google } from '/functions/firebase'
import { validateEmail, validateEmpty } from '/functions/utils'

export default function login() {

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(null)

    // ====================================================================
    // LOGIN STATES
    // ====================================================================
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPass, setLoginPass] = useState("")

    /***
     *                                              
     *     ###### ###### ###### ######  ####  ##### 
     *     #      #      #      #      #    #   #   
     *     #####  #####  #####  #####  #        #   
     *     #      #      #      #      #        #   
     *     #      #      #      #      #    #   #   
     *     ###### #      #      ######  ####    #   
     *                                              
     */
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if(user) {
                router.push('/app')
            }else{
                setLoading(false)
            }
        })

    }, [])

    /***
     *                                                                                
     *     #    #   ##   #    # #####  #      ######    #       ####   ####  # #    # 
     *     #    #  #  #  ##   # #    # #      #         #      #    # #    # # ##   # 
     *     ###### #    # # #  # #    # #      #####     #      #    # #      # # #  # 
     *     #    # ###### #  # # #    # #      #         #      #    # #  ### # #  # # 
     *     #    # #    # #   ## #    # #      #         #      #    # #    # # #   ## 
     *     #    # #    # #    # #####  ###### ######    ######  ####   ####  # #    # 
     *                                                                                
     */

    const handleLogin = (e, provider) => {

        // ====================================================================
        // Check providers
        // ====================================================================
        if(provider === "google") {
            auth.signInWithPopup(google)
            .then(result => {
                if(result.additionalUserInfo.isNewUser === true) {
                    // ====================================================================
                    // Adds user if it is new
                    // ====================================================================
                    const data = {
                        name: result.user.displayName,
                        email: result.user.email,
                        profile_picture: result.user.photoURL,
                        userid: result.user.uid,
                        email_verified: result.user.emailVerified,
                        account_setup: false
                    }
                    insertUserInDB(data)
                    .then(r => router.push('/app/account/setup'))
                }
            })
            .catch(err => setErrors("Une erreur est survenue. Veuillez réessayer."))


        }else if(provider === "creds") {
            e.preventDefault()

            if(!validateEmpty(loginEmail) || !validateEmpty(loginPass)) {
                return setErrors("Veuillez remplir tous les champs.")
            }

            if(!validateEmail(loginEmail)) {
                return setErrors("Veuillez entrer une adresse courriel valide.")
            }


            auth.signInWithEmailAndPassword(loginEmail, loginPass)
            .catch(err => {
                setErrors("Adresse courriel ou mot de passe invalide.")
            })
        }
    }


    return (
        <>
            <Head>
                <title>Babillio - Connexion</title>
            </Head>

            { loading ? <Loader/> :
            
                <section className="login-container">
                    
                    <div className="login-formbox">

                        <form className="login-formbox_form" onSubmit={(e) => handleLogin(e, "creds")}>

                            <h1>Content de vous revoir!</h1>
                            <p>Saisissez les informations suivante pour accèder à votre compte.</p>

                            <button type="button" className="login-googlebtn" onClick={(e) => handleLogin(e, "google")}>
                                <div className="google-logo"></div>
                                <span>Connexion avec Google</span>
                            </button>

                            <div className="login-separator">ou</div>

                            <div className="login-input_container">
                                <HiOutlineAtSymbol />
                                <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} id="login-email" autoFocus="autofocus" type="text" className="login-input" placeholder=" "/>
                                <span className="login-label">Adresse courriel</span>
                            </div>

                            <div className="login-input_container">
                                <HiOutlineLockClosed />
                                <input value={loginPass} onChange={e => setLoginPass(e.target.value)} id="login-password" type="password" className="login-input" placeholder=" "/>
                                <span className="login-label">Mot de passe</span>
                            </div>
                            
                            <input type="submit" className="cta white" value="Connexion" />

                            
                            <div className="login-links">
                                <Link href="/app/account/register">
                                    <a>Pas encore de compte?</a>
                                </Link>
                                <Link href="/app/account/recover">
                                    <a>J'ai perdu mon mot de passe</a>
                                </Link>
                            </div>
                            

                        </form>

                    </div>

                    <div className="login-sidebox login">
                        <a href="#" className="login-logo"></a>
                        {
                            errors ? 
                            <div className="login-errors">
                                {errors}
                            </div> : null
                        }
                    </div>

                </section>
            
            }
        </>
    )
}
