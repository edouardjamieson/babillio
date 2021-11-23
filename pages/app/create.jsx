import gsap from "gsap";
import { useRef, useState } from "react";

import { validateEmpty, getDayName } from "../../functions/utils";

import Calendar from "react-calendar";
import Layout from "/components/Layout";
import { addCourse } from "/functions/course.db";
import { Router, useRouter } from "next/dist/client/router";
import Modal from "/components/Modal";
import ErrorAlert from "/components/ErrorAlert";

export default function create() {

    const router = useRouter()

    // ====================================================================
    // COURSE DATA
    // ====================================================================
    const [courseName, setCourseName] = useState("")
    const [courseIcon, setCourseIcon] = useState("⚡")
    const [courseDates, setCourseDates] = useState({
        from: {
            calendar: new Date(),
            iso: Date.now(),
            local: new Date().toLocaleDateString(),
            text: 'Choisir une date',
            default: true
        },
        to: {
            calendar: new Date(),
            iso: Date.now(),
            local: new Date().toLocaleDateString(),
            text: 'Choisir une date',
            default: true
        }
    })
    const [courseTimeSlots, setCourseTimeSlots] = useState([])
    const [courseTimeSlotDay, setcourseTimeSlotDay] = useState("monday")
    const [courseTimeSlotPlace, setcourseTimeSlotPlace] = useState("")
    const [courseTimeSlotHourFrom, setcourseTimeSlotHourFrom] = useState("")
    const [courseTimeSlotHourTo, setcourseTimeSlotHourTo] = useState("")


    const [currentModal, setCurrentModal] = useState("icons")
    const [modalVisible, setModalVisible] = useState(false)
    const modalTitles = {
        "icons": "Selectionnez une icon",
        "calendar-from": "Choisir une date de début de cours",
        "calendar-to": "Choisir une date de fin de cours"
    }
    const [errors, setErrors] = useState("")
    const [courseCreatorStep, setCourseCreatorStep] = useState(0)

    
    // ====================================================================
    // ICONS
    // ====================================================================
    const IconSelector = () => {
        const possible_icons = ["⚡", "👽", "✋", "💅", "✍️", "🦵", "👂", "🧠", "🫁", "🦷", "🦴", "👀", "👶", "🧑", "🧓", "🧑‍🏫", "🧑‍🔧", "🧑‍🍳", "🧑‍🚀", "🧳", "🕶️", "🥼", "🦺", "👟", "💍"]

        return (
            <div className="course-creator_icons">
                {
                    possible_icons.map((icon,x)=> <button key={x} onClick={() => handleIconSelector(icon)} className="course-creator_icon-set">{icon}</button>)
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
    const toggleDateSelector = (state) => {
        if(state === 'from') {
            setCurrentModal('calendar-from')
        }else{
            setCurrentModal('calendar-to')
        }
        setModalVisible(true)
    }

    const handleDateSelection = (value) => {
        const iso = new Date(value).getTime()
        const local = new Date(value).toLocaleDateString()
        const date = new Date(value)
        
        const dates = courseDates
        const datepicker = currentModal === 'calendar-from' ? 'from' : 'to'
        dates[datepicker].iso = iso
        dates[datepicker].local = local
        dates[datepicker].calendar = date
        dates[datepicker].text = local
        dates[datepicker].default = false

        setModalVisible(false)
    }

    const handleAddTimeSlot = () => {
        if(!validateEmpty(courseTimeSlotPlace)) {
            return setErrors('Veuillez inscrire un local pour le cours.')
        }
        if(!validateEmpty(courseTimeSlotHourFrom)) {
            return setErrors('Veuillez inscrire une heure de début pour le cours.')
        }
        if(!validateEmpty(courseTimeSlotHourTo)) {
            return setErrors('Veuillez inscrire une heure de fin pour le cours.')
        }

        const from = {
            h: parseInt(courseTimeSlotHourFrom.split(':')[0]),
            m: parseInt(courseTimeSlotHourFrom.split(':')[1])
        }
        const to = {
            h: parseInt(courseTimeSlotHourTo.split(':')[0]),
            m: parseInt(courseTimeSlotHourTo.split(':')[1])
        }
        
        if(from.h > to.h) {
            return setErrors('Heure de début invalide!')
        }
        if(from.h === to.h && from.m >= to.m) {
            return setErrors('Heure de début invalide!')
        }

        const data = {
            day: courseTimeSlotDay,
            place: courseTimeSlotPlace,
            time: {
                from : courseTimeSlotHourFrom,
                to: courseTimeSlotHourTo
            }
        }
        const times = courseTimeSlots
        times.push(data)

        return data
    }

    const handleAddMoreTimeSlot = () => {

        const data = handleAddTimeSlot()
        if(data !== undefined) {
            
            //reset states for new time slot
            setcourseTimeSlotDay("monday")
            setcourseTimeSlotPlace("")
            setcourseTimeSlotHourFrom("")
            setcourseTimeSlotHourTo("")
        }

    }

    const handleEditTimeSlot = (x) => {
        
        const slots = [...courseTimeSlots]
        const slot = slots[x]
        setcourseTimeSlotDay(slot.day)
        setcourseTimeSlotPlace(slot.place)
        setcourseTimeSlotHourFrom(slot.time.from)
        setcourseTimeSlotHourTo(slot.time.to)

        setCourseTimeSlots(slots.filter((s,i) => i !== x))
    }

    // ====================================================================
    // STEPS
    // ====================================================================
    const handleChangeStep = (step) => {
        if(courseCreatorStep === 0) {
            if(courseDates.to.default === true || courseDates.from.default === true) {
                return setErrors('Veuillez choisir des dates pour votre cours.')
            }
            if(courseDates.to.iso <= courseDates.from.iso) {
                return setErrors('La date de fin du cours doit être après celle de début du cours.')
            }
            if(!validateEmpty(courseName)) {
                return setErrors('Le nom du cours ne peu être vide.')
            }

            setErrors("")
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
            case "calendar-from":
                return <Calendar minDate={courseDates.from.calendar} value={courseDates.from.calendar} onChange={handleDateSelection} />
            case "calendar-to":
                return <Calendar minDate={courseDates.from.calendar} value={courseDates.to.calendar} onChange={handleDateSelection} />
            default:
                return null
        }
    }

    // ====================================================================
    // CREATE COURSE
    // ====================================================================
    const handleCreateCourse = () => {

        //If one of the three inputs is empty we do not add new time
        handleAddTimeSlot()
        if(courseTimeSlots.length < 1) {
            return setErrors("Veuillez définir au moins une plage horaire.")
        }

        const course = {
            icon: courseIcon,
            name: courseName,
            dates: {
                from : courseDates.from.iso,
                to: courseDates.to.iso
            },
            times: courseTimeSlots,
            created_at: Date.now(),
            groups: [],
            files:[]
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
        >

            <section className="course-creator_container">
                <div className="course-creator">
                    {
                        courseCreatorStep === 0 ?
                        <>
                            <h2>Créer un cours</h2>
                            <div className="course-creator_icon">
                                <button className="course-creator_icon-picker" onClick={() => toggleIconSelector()}>{courseIcon}</button>
                                <div>
                                    <strong>Icon du cours</strong>
                                    <span>Cliquez sur l'icon pour choisir</span>
                                </div>
                            </div>
                            <div className="course-creator_infos">
                                <span className="input-label">Nom du cours</span>
                                <div className="input-container">
                                    <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="input-container_input" placeholder=" " />
                                    <span className="input-container_label">Histoire et géographie</span>
                                </div>
                                <div className="course-creator_dates">
                                    <span className="input-label">Date de début du cours</span>
                                    <span className="input-label">Date de fin du cours</span>
                                    <button className="course-creator_date-button" onClick={() => toggleDateSelector('from')}>
                                        <i className="icon-calendar"></i>
                                        <span>{ courseDates.from.text }</span>
                                    </button>
                                    <button className="course-creator_date-button" onClick={() => toggleDateSelector('to')}>
                                        <i className="icon-calendar"></i>
                                        <span>{ courseDates.to.text }</span>
                                    </button>
                                </div>
                            </div>
                            <div className="course-creator_buttons">
                                <button className="cta blue" onClick={() => handleChangeStep(1)}>Suivant</button>
                            </div>
                        </> :
                        <>
                            <h2>Ajouter des plages horaires</h2>
                            {courseTimeSlots.length > 0 ?
                            <div className="course-creator_timeslots">
                                {
                                    courseTimeSlots.map((slot,x) => 
                                    <div className="course-creator_timeslot" key={x} onClick={() => handleEditTimeSlot(x)}>
                                        {x}
                                        <span>{getDayName(slot.day)}</span>
                                        <i>({slot.time.from} à {slot.time.to})</i>
                                        <strong>{slot.place}</strong>
                                    </div>    
                                    )
                                }
                            </div> : null }
                            <div className="course-creator_schedules">
                                <span className="input-label">Jour du cours</span>
                                <span className="input-label">Local du cours</span>
                                <div className="input-container">
                                    <span className="input-container_label-chooser">Jour</span>
                                    <select className="input-container_chooser" value={courseTimeSlotDay} onChange={e => setcourseTimeSlotDay(e.target.value)}>
                                        <option value="monday">Lundi</option>
                                        <option value="tuesday">Mardi</option>
                                        <option value="wednesday">Mercredi</option>
                                        <option value="thursday">Jeudi</option>
                                        <option value="friday">Vendredi</option>
                                        <option value="saturday">Samedi</option>
                                        <option value="sunday">Dimanche</option>
                                    </select>
                                </div>
                                <div className="input-container">
                                    <input type="text" value={courseTimeSlotPlace} onChange={e => setcourseTimeSlotPlace(e.target.value)} className="input-container_input" placeholder=" " />
                                    <span className="input-container_label">A-1234</span>
                                </div>
                                <span className="input-label">Heure de début du cours</span>
                                <span className="input-label">Heure de fin du cours</span>
                                <div className="input-container">
                                    <span className="input-container_label-chooser">Heure</span>
                                    <input value={courseTimeSlotHourFrom} onChange={e => setcourseTimeSlotHourFrom(e.target.value)} type="time" className="input-container_time" />
                                </div>                     
                                <div className="input-container">
                                    <span className="input-container_label-chooser">Heure</span>
                                    <input value={courseTimeSlotHourTo} onChange={e => setcourseTimeSlotHourTo(e.target.value)} type="time" className="input-container_time" />
                                </div>
                                <button className="course-creator_schedules-add" onClick={() => handleAddMoreTimeSlot()}>Ajouter une autre plage horaire</button>                    
                            </div> 
                            
                            
                            <div className="course-creator_buttons">
                                <button className="cta gray" onClick={() => handleChangeStep(0)}>Précédent</button>
                                <button className="cta blue" onClick={() => handleCreateCourse()}>Suivant</button>
                            </div>
                        </>
                    }
                </div>

            </section>

            <ErrorAlert onClick={() => setErrors("")} visible={validateEmpty(errors)} content={errors}/>

            <Modal
                title={modalTitles[currentModal]}
                visible={modalVisible}
            >
                <ModalContent/>
            </Modal>

        </Layout>
    )
}
