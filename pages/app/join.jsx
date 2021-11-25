import gsap from "gsap";
import { useRef, useState } from "react";

import { validateEmpty, getDayName } from "../../functions/utils";

import Calendar from "react-calendar";
import Layout from "/components/Layout";
import { addCourse } from "/functions/course.db";
import { Router, useRouter } from "next/dist/client/router";
import Modal from "/components/Modal";
import ErrorAlert from "/components/ErrorAlert";

export default function join() {

    const router = useRouter()

    const [groupeCode, setGroupeCode] = useState("")
    const [error, setError] = useState("")

    const handleJoinGroup = () => {

        if(!validateEmpty(groupeCode)) {
            return setError("Veuillez entrer un code valide.")
        }

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
