import gsap from "gsap";
import { useRef, useState } from "react";

import { validateEmpty, getDayName } from "/functions/utils";

import Calendar from "react-calendar";
import Layout from "/components/Layout";
import { addCourse } from "/functions/course.db";
import { Router, useRouter } from "next/dist/client/router";
import Modal from "/components/Modal";
import ErrorAlert from "/components/ErrorAlert";
import Input from "/components/Input";

export default function course() {

    const router = useRouter()

    const [user, setUser] = useState(null)

    // ====================================================================
    // COURSE DATA
    // ====================================================================
    const [courseName, setCourseName] = useState("")
    const [courseIcon, setCourseIcon] = useState("⚡")
    const [courseDates, setCourseDates] = useState(
        [
            {
                type:'from',
                date: new Date().toLocaleDateString(),
                formated: Date.now()
            },
            {
                type:'to',
                date: new Date().toLocaleDateString(),
                formated: Date.now()
            },
        ]
    )


    const [currentModal, setCurrentModal] = useState("icons")
    const [modalVisible, setModalVisible] = useState(false)
    const modalTitles = {
        "icons": "Selectionnez une icon",
    }
    const [errors, setErrors] = useState("")

    
    // ====================================================================
    // ICONS
    // ====================================================================
    const IconSelector = () => {
        const possible_icons = ["⚡", "👽", "✋", "💅", "✍️", "🦵", "👂", "🧠", "🫁", "🦷", "🦴", "👀", "👶", "🧑", "🧓", "🧑‍🏫", "🧑‍🔧", "🧑‍🍳", "🧑‍🚀", "🧳", "🕶️", "🥼", "🦺", "👟", "💍", "🎣",
        "🎤",
        "🎥","🎬",
        "🎭",
        "🎮","🎸",
        "🎹",
        "🎺",
        "🎻","🏅",
        "🏆","🏋","🏒",]

        return (
            <div className="content-creator_icons">
                {
                    possible_icons.map((icon,x)=> <button key={x} onClick={() => handleIconSelector(icon)} className="content-creator_icon-set">{icon}</button>)
                }
            </div>
        )
    }

    const toggleIconSelector = () => {
        setCurrentModal('icons')
        setModalVisible(true)
    }

    const handleIconSelector = (icon) => {
        setCourseIcon(icon)
        setModalVisible(false)
    }

    // ====================================================================
    // DATES
    // ====================================================================
    const handleDateSelection = (value, picker) => {
        const iso = new Date(value).getTime()
        const local = new Date(value).toLocaleDateString()        
        const dates = [...courseDates]

        const index = picker === 'from' ? 0 : 1
        dates[index].formated = iso
        dates[index].date = local

        setCourseDates(dates)
    }

    // ====================================================================
    // STEPS
    // ====================================================================
    const handleChangeStep = (step) => {
        if(courseCreatorStep === 0) {
            if(courseDates[1].formated <= courseDates[0].formated) {
                return setErrors('La date de fin du cours doit être après celle de début du cours.')
            }
            if(!validateEmpty(courseName)) {
                return setErrors('Le nom du cours ne peu être vide.')
            }

            setCourseCreatorTitle("Ajouter des plages horaires")
            setErrors("")
        }else {
            setCourseCreatorTitle("Créer un cours")
        }

        setCourseCreatorStep(step)
    }

    // ====================================================================
    // MODAL CONTENT
    // ====================================================================
    const ModalContent = () => {
        switch (currentModal) {
            case "icons":
                return <IconSelector />
            default:
                return null
        }
    }

    // ====================================================================
    // CREATE COURSE
    // ====================================================================
    const handleCreateCourse = () => {

        //If one of the three inputs is empty we do not add new time
        // handleAddTimeSlot()
        // if(courseTimeSlots.length < 1) {
        //     return setErrors("Veuillez définir au moins une plage horaire.")
        // }

        if(courseDates[1].formated <= courseDates[0].formated) {
            return setErrors('La date de fin du cours doit être après celle de début du cours.')
        }
        if(!validateEmpty(courseName)) {
            return setErrors('Le nom du cours ne peu être vide.')
        }

        const course = {
            icon: courseIcon,
            name: courseName,
            dates: {
                from : courseDates[0].formated,
                to: courseDates[1].formated
            },
            created_at: Date.now(),
            created_by: user.id
        }

        addCourse(course)
        .then(() => router.push('/app'))
        
    }



    return (
        <Layout
            pageTitle="Créer un cours"
            requiresCourse={false}
            navigationVisible={true}
            id="course-creator"
            onGetUserInfos={data => setUser(data)}
        >

            <section className="content-creator_container">
                <h1>Créer un cours</h1>
                <div className="content-creator">
                    <div className="content-creator_icon">
                        <button className="content-creator_icon-picker" onClick={() => toggleIconSelector()}>{courseIcon}</button>
                        <div>
                            <strong>Icon du cours</strong>
                            <span>Cliquez sur l'icon pour choisir</span>
                        </div>
                    </div>
                    <div className="content-creator_infos">
                        <span className="input-label">Nom du cours</span>
                        <Input
                            type="text"
                            value={courseName}
                            onChange={val => setCourseName(val)}
                            placeholder="Histoire et géographie"
                        />

                        <div className="content-creator_dates">
                            <span className="input-label">Date de début du cours</span>
                            <span className="input-label">Date de fin du cours</span>
                            <Input
                                type="date"
                                onChange={val => handleDateSelection(val, 'from')}
                                placeholder={courseDates[0].date}
                            />
                            <Input
                                type="date"
                                onChange={val => handleDateSelection(val, 'to')}
                                placeholder={courseDates[1].date}
                            />
                        </div>
                    </div>
                    <div className="content-creator_buttons">
                        <button className="cta blue" onClick={() => handleCreateCourse()}>Terminé</button>
                    </div>
                </div>

            </section>

            <ErrorAlert onClick={() => setErrors("")} visible={validateEmpty(errors)} content={errors}/>

            <Modal
                title={modalTitles[currentModal]}
                visible={modalVisible}
                onExit={() => setModalVisible(false)}
            >
                <ModalContent/>
            </Modal>

        </Layout>
    )
}
