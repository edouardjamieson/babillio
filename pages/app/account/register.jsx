import Head from 'next/head'
import Link from 'next/link'
import Loader from '/components/Loader'

import { useRouter } from 'next/dist/client/router'
import { useState, useEffect, useRef } from 'react'

import { getAuth, insertUserInDB } from '/functions/user.db'
import { auth, google } from '/functions/firebase'
import { validateEmail, validateEmpty, validatePassword } from '/functions/utils'
import { HiOutlineAtSymbol, HiOutlineLockClosed } from 'react-icons/hi'

export default function register() {

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState(null)

    // ====================================================================
    // REGISTER STATES
    // ====================================================================
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPass1, setRegisterPass1] = useState("")
    const [registerPass2, setRegisterPass2] = useState("")

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
     *     #    #   ##   #    # #####  #      ######    #####  ######  ####  #  ####  ##### ###### #####  
     *     #    #  #  #  ##   # #    # #      #         #    # #      #    # # #        #   #      #    # 
     *     ###### #    # # #  # #    # #      #####     #    # #####  #      #  ####    #   #####  #    # 
     *     #    # ###### #  # # #    # #      #         #####  #      #  ### #      #   #   #      #####  
     *     #    # #    # #   ## #    # #      #         #   #  #      #    # # #    #   #   #      #   #  
     *     #    # #    # #    # #####  ###### ######    #    # ######  ####  #  ####    #   ###### #    # 
     *                                                                                                    
     */

    const handleRegister = (e, provider) => {
        // ====================================================================
        // Check providers
        // ====================================================================
        if(provider === "google") {
            auth.signInWithPopup(google)
            .then(result => {
                if(result.additionalUserInfo.isNewUser === true) {
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

            if(!validateEmpty(registerEmail) || !validateEmpty(registerPass1) || !validateEmpty(registerPass2)) {
                return setErrors("Veuillez remplir tous les champs.")
            }

            if(!validateEmail(registerEmail)) {
                return setErrors("Veuillez entrer une adresse courriel valide.")
            }

            if(!validatePassword(registerPass1)) {
                return setErrors("Votre mot de passe doit contenir au moins 6 charactères ainsi qu'au moins un chiffre.")
            }

            if(registerPass1 !== registerPass2) {
                return setErrors("Les deux mots de passe doivent être identiques.")
            }

            auth.createUserWithEmailAndPassword(registerEmail, registerPass1)
            .then(result => {
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
            })
            .catch(err => {
                if(err.code === "auth/email-already-in-use") {
                    return setErrors("Cette adresse courriel est déjà utilisée.")
                }
            })
        }
    }

    return (
        <>
            <Head>
                <title>Babillio - Créer mon compte</title>
            </Head>

            { loading ? <Loader/> :
            
            <section className="login-container">
                    
                <div className="login-formbox">

                    <form className="login-formbox_form" onSubmit={(e) => handleRegister(e, "creds")}>

                        <h1>Content de vous rencontrer!</h1>
                        <p>Saisissez les informations suivante pour créer votre compte.</p>

                        <button type="button" className="login-googlebtn" onClick={() => handleRegister("google")}>
                            <div className="google-logo"></div>
                            <span>Inscription avec Google</span>
                        </button>

                        <div className="login-separator">ou</div>

                        <div className="login-input_container">
                            <HiOutlineAtSymbol />
                            <input value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} id="login-email" type="text" className="login-input" placeholder=" "/>
                            <span className="login-label">Adresse courriel</span>
                        </div>

                        <div className="login-input_container">
                            <HiOutlineLockClosed />
                            <input value={registerPass1} onChange={(e) => setRegisterPass1(e.target.value)} id="login-password" type="password" className="login-input" placeholder=" "/>
                            <span className="login-label">Mot de passe</span>
                        </div>

                        <div className="login-input_container">
                            <HiOutlineLockClosed />
                            <input value={registerPass2} onChange={(e) => setRegisterPass2(e.target.value)} id="login-password2" type="password" className="login-input" placeholder=" "/>
                            <span className="login-label">Mot de passe (encore)</span>
                        </div>

                        <input type="submit" className="cta white" value="Créer mon compte" />

                        <p className="login-warning">
                            En créant votre compte vous acceptez nos <a href="#">Conditions d'utilisations</a> ainsi que nos <a href="#">Politiques de confidentalité</a>.
                        </p>
                        <div className="login-links">
                            <Link href="/app/account/login">
                                <a>Vous avez déjà un compte?</a>
                            </Link>
                        </div>
                        

                    </form>

                </div>

                <div className="login-sidebox register">
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
