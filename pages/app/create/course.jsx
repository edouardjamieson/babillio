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
    const [courseIcon, setCourseIcon] = useState("âĄ")
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
        const possible_icons = ["âĄ", "ð―", "â", "ð", "âïļ", "ðĶĩ", "ð", "ð§ ", "ðŦ", "ðĶ·", "ðĶī", "ð", "ðķ", "ð§", "ð§", "ð§âðŦ", "ð§âð§", "ð§âðģ", "ð§âð", "ð§ģ", "ðķïļ", "ðĨž", "ðĶš", "ð", "ð", "ðĢ",
        "ðĪ",
        "ðĨ","ðŽ",
        "ð­",
        "ðŪ","ðļ",
        "ðđ",
        "ðš",
        "ðŧ","ð",
        "ð","ð","ð",]

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
                return setErrors('La date de fin du cours doit ÃŠtre aprÃĻs celle de dÃĐbut du cours.')
            }
            if(!validateEmpty(courseName)) {
                return setErrors('Le nom du cours ne peu ÃŠtre vide.')
            }

            setCourseCreatorTitle("Ajouter des plages horaires")
            setErrors("")
        }else {
            setCourseCreatorTitle("CrÃĐer un cours")
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

        if(courseDates[1].formated <= courseDates[0].formated) {
            return setErrors('La date de fin du cours doit ÃŠtre aprÃĻs celle de dÃĐbut du cours.')
        }
        if(!validateEmpty(courseName)) {
            return setErrors('Le nom du cours ne peu ÃŠtre vide.')
        }

        const course = {
            icon: courseIcon,
            name: courseName,
            dates: {
                from : courseDates[0].formated,
                to: courseDates[1].formated
            },
            created_at: Date.now(),
            created_by: user.id,
            groups: []
        }

        addCourse(course)
        .then(() => router.push('/app'))
        .catch(() => setErrors("Une erreur est survenue, veuillez rÃĐessayer."))
        
    }



    return (
        <Layout
            pageTitle="CrÃĐer un cours"
            requiresCourse={false}
            navigationVisible={true}
            id="course-creator"
            onGetUserInfos={data => setUser(data)}
        >

            <section className="content-creator_container">
                <h1>CrÃĐer un cours</h1>
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
                            placeholder="Histoire et gÃĐographie"
                        />

                        <div className="content-creator_dates">
                            <span className="input-label">Date de dÃĐbut du cours</span>
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
                        <button className="cta blue" onClick={() => handleCreateCourse()}>TerminÃĐ</button>
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
