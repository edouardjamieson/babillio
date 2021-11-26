import { useEffect, useState, useRef } from "react";
import { validateEmpty } from "../../functions/utils";

import Layout from "/components/Layout";
import { useRouter } from "next/dist/client/router";
import ErrorAlert from "/components/ErrorAlert";
import { getGroupByCode } from "../../functions/course.db";
import { addUserToGroup } from "../../functions/user.db";
import { auth } from "../../functions/firebase";

export default function join() {

    const router = useRouter()

    const [groupeCode, setGroupeCode] = useState("")
    const [error, setError] = useState("")

    const handleJoinGroup = () => {

        if(!validateEmpty(groupeCode)) {
            return setError("Veuillez entrer un code valide.")
        }

        getGroupByCode(groupeCode)
        .then(group => {
            if(group === 0) {
                return setError("Ce code est invalide.")
            }
            // gr123-P2TYgu
            addUserToGroup(group.data().course_id, group.id, auth.currentUser.uid)
            .then(result => {
                if(result === 0) {
                    return setError("Vous êtes déjà dans ce groupe.")
                }
                router.push('/app/select')
            })
        })

    }

    return (
        <Layout
            pageTitle="Rejoindre un cours"
            requiresCourse={false}
            navigationVisible={true}
            id="course-join"
        >

            <section className="course-join">
                <div className="course-join_form">
                    <h1>Rejoindre un cours</h1>
                    <p>Entrez le code du groupe donné par votre enseignant(e) ci-dessous pour rejoindre votre groupe.</p>
                    <div className="input-container">
                        <input type="text" value={groupeCode} onChange={(e) => setGroupeCode(e.target.value)} className="input-container_input" placeholder=" " />
                        <span className="input-container_label">gr123-XXXXX</span>
                    </div>
                    <button className="cta blue" onClick={() => handleJoinGroup()}>Rejoindre</button>
                    <div className="course-join_bg"></div>
                </div>
                <ErrorAlert visible={validateEmpty(error)} content={error} onClick={() => setError("")} />
            </section>

        </Layout>
    )
}

