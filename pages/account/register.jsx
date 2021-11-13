import Head from 'next/head'
import Link from 'next/link'
import Loader from '../../components/Loader'

import { Router, useRouter } from 'next/dist/client/router'
import { useState, useEffect, useRef } from 'react'

import { getAuth, insertUserInDB } from '../../functions/user.db'
import { auth, google } from '../../functions/firebase'
import { validateEmail, validateEmpty, validatePassword } from '../../functions/utils'

export default function register() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [errors, setErrors] = useState(null)

    // ====================================================================
    // REGISTER REFS
    // ====================================================================
    const register_email = useRef()
    const register_pass1 = useRef()
    const register_pass2 = useRef()

    // ====================================================================
    // CHECK IF USER IS LOGGED IN
    // ====================================================================
    useEffect(() => {
        getAuth((user) => {
            if(user !== null) router.push('/')
        })

        setIsLoading(false)
    }, [])

    const handleRegister = (provider) => {
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
                    .then(r => router.push('/account/setup'))
                }else{
                    router.push('/')
                }
            })
            .catch(err => null)

        }else if(provider === "creds") {

            const email = register_email.current.value
            const password = register_pass1.current.value
            const password2 = register_pass2.current.value

            if(!validateEmpty(email) || !validateEmpty(password) || !validateEmpty(password2)) {
                return setErrors("Veuillez remplir tous les champs.")
            }

            if(!validateEmail(email)) {
                return setErrors("Veuillez entrer une adresse courriel valide.")
            }

            if(!validatePassword(password)) {
                return setErrors("Votre mot de passe doit contenir au moins 6 charactères ainsi qu'au moins un chiffre.")
            }

            if(password !== password2) {
                return setErrors("Les deux mots de passe doivent être identiques.")
            }

            auth.createUserWithEmailAndPassword(email, password)
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
                .then(r => router.push('/account/setup'))
            })
            .catch(err => {
                console.log(err);
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
                <meta name="description" content="Babillio - L'application pour les enseignants et éléves qui révolutionne les cours." />
            </Head>

            { isLoading ? <Loader/> :
            
            <section className="login-container">
                    
                <div className="login-formbox">

                    <div className="login-formbox_form">

                        <h1>Content de vous rencontrer!</h1>
                        <p>Saisissez les informations suivante pour créer votre compte.</p>

                        <button type="button" className="login-googlebtn" onClick={() => handleRegister("google")}>
                            <div className="google-logo"></div>
                            <span>Inscription avec Google</span>
                        </button>

                        <div className="login-separator">ou</div>

                        <div className="login-input_container">
                            <i className="icon-email"></i>
                            <input ref={register_email} id="login-email" type="text" className="login-input" placeholder=" "/>
                            <span className="login-label">Adresse courriel</span>
                        </div>

                        <div className="login-input_container">
                            <i className="icon-lock"></i>
                            <input ref={register_pass1} id="login-password" type="password" className="login-input" placeholder=" "/>
                            <span className="login-label">Mot de passe</span>
                        </div>

                        <div className="login-input_container">
                            <i className="icon-lock"></i>
                            <input ref={register_pass2} id="login-password2" type="password" className="login-input" placeholder=" "/>
                            <span className="login-label">Mot de passe (encore)</span>
                        </div>

                        <button type="button" className="cta white" onClick={() => handleRegister("creds")}>Créer mon compte</button>
          
                        <p className="login-warning">
                            En créant votre compte vous acceptez nos <a href="#">Conditions d'utilisations</a> ainsi que nos <a href="#">Politiques de confidentalité</a>.
                        </p>
                        <div className="login-links">
                            <Link href="/account/login">
                                <a>Vous avez déjà un compte?</a>
                            </Link>
                        </div>
                        

                    </div>

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
