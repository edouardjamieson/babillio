import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/dist/client/router'

import Layout from "../../components/Layout";

import { validateEmpty } from "../../functions/utils";
import { editUserByID, getAuth, getUserByID } from "../../functions/user.db";

export default function setup() {

    const [step, setStep] = useState(0)
    const [setup_profile, setSetup_profile] = useState(null)
    const [errors, setErrors] = useState(null)
    const [user, setUser] = useState(null)
    const setup_name = useRef()
    const setup_school = useRef()
    const setup_gender = useRef()

    const router = useRouter()

    useEffect(() => {
        getAuth((user) => {
            getUserByID(user.uid)
            .then(u => {
                console.log(u.data());
                if(u.data().hasOwnProperty('account_setup') && u.data().account_setup === false) {
                    setUser(u)
                }else{
                    router.push('/')
                }
            })
        })

    }, [])


    const handleSetupAccount = () => {

        const name = user.data().name ? user.data().name : setup_name.current.value
        const school = setup_school.current.value
        const gender = setup_gender.current.value
        const profile = setup_profile

        if(!validateEmpty(name)) {
            setErrors("Au moins un champ est manquant")
            return
        }
        if(!validateEmpty(school)) {
            setErrors("Au moins un champ est manquant")
            return
        }

        let pic
        switch (gender) {
            case "female":
                pic = "https://firebasestorage.googleapis.com/v0/b/babillio.appspot.com/o/female%20avatar.png?alt=media&token=1d8a733d-0281-48b3-a531-61c55bc37bb7"
                break;
            case "male":
                pic = "https://firebasestorage.googleapis.com/v0/b/babillio.appspot.com/o/man%20avatar.png?alt=media&token=a74609af-7685-4c52-8dbf-de6b90c15676"
                break;
            case "other":
                pic = "https://firebasestorage.googleapis.com/v0/b/babillio.appspot.com/o/neutral%20avatar.png?alt=media&token=e80ab0fc-dcc9-494a-beac-c31a094b609e"
                break;
            default:
                pic = "https://firebasestorage.googleapis.com/v0/b/babillio.appspot.com/o/neutral%20avatar.png?alt=media&token=e80ab0fc-dcc9-494a-beac-c31a094b609e"
                break;
        }

        let new_infos = {
            name: name,
            school: school,
            gender: gender,
            profile_picture: user.data().profile_picture ? user.data().profile_picture : pic,
            account_setup: true,
            type: profile
        }

        editUserByID(user.id, new_infos)
        .then(r => {
            router.push('/')
        })

    }

    const Steps = () => {

        if(step === 0) {
            return(
                <div className="setup-account_step">
                    <h1>Bienvenue sur babillio!</h1>
                    <p>Commençons la configuration de votre compte. Cela ne prendra que quelques minutes.</p>
                    <button className="cta blue" onClick={() => setStep(1)}>Commencer</button>
                </div>
            )
        }else if(step === 1) {
            return(
                <div className="setup-account_step">
                    <h1>Quel profil vous conviens le mieux ?</h1>
                    <p>Choisissez entre les deux options ci-dessous.</p>
                    <div className="setup-account_buttons">
                        <button className="setup-account_profile" onClick={() => { setSetup_profile('student'); setStep(2) }}>
                            <div className="student"></div>
                            <span>Étudiant(e)</span>
                        </button>
                        <button className="setup-account_profile" onClick={() => { setSetup_profile('teacher'); setStep(2) }}>
                            <div className="teacher"></div>
                            <span>Enseignant(e)</span>
                        </button>
                    </div>
                </div>
            )
        }else if(step === 2) {
            return (
                <div className="setup-account_step">
                    <h1>Dites-nous en plus sur vous.</h1>

                    {user && user.data().name ? null :
                    <div className="input-container">
                        <input ref={setup_name} type="text" placeholder=" " className="input-container_input" />
                        <span className="input-container_label">Nom complet</span>
                    </div> }
                    <div className="input-container">
                        <input ref={setup_school} type="text" placeholder=" " className="input-container_input" />
                        <span className="input-container_label">École fréquentée</span>
                    </div>
                    <div className="input-container">
                        <span className="input-container_label-chooser">Sexe</span>
                        <select ref={setup_gender} className="input-container_chooser">
                            <option value="other">Autre</option>
                            <option value="male">Homme</option>
                            <option value="female">Femme</option>
                        </select>
                    </div>

                    <button className="cta blue" onClick={() => handleSetupAccount()}>Terminé</button>
                </div>
            )
        }

    }

    return (
        <Layout pageTitle="Configurer mon compte" navigationVisible={true}>
            
            <section className="setup-account">
                <Steps/>
            </section>

        </Layout>
    )
}
