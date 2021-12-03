import { useRouter } from "next/dist/client/router";
import { useState, useEffect } from "react";
import Input from "../../../components/Input";
import Layout from "/components/Layout";
import Loader from "/components/Loader";
import { validateEmpty, getDayName } from "../../../functions/utils";
import ErrorAlert from '/components/ErrorAlert'

export default function group() {

    const router = useRouter()
    const course_id = router.query.course

    const [groupInfos, setGroupInfos] = useState(null)
    const [userInfos, setUserInfos] = useState(null)

    const [step, setStep] = useState(0)
    const [errors, setErrors] = useState("")

    const [newGroupTimeSlots, setNewGroupTimeSlots] = useState([])
    const [newGroupTimeSlotDay, setNewGroupTimeSlotDay] = useState("monday")
    const [newGroupTimeSlotPlace, setNewGroupTimeSlotPlace] = useState("")
    const [newGroupTimeSlotHourFrom, setNewGroupTimeSlotHourFrom] = useState("")
    const [newGroupTimeSlotHourTo, setNewGroupTimeSlotHourTo] = useState("")
    const [newGroupName, setNewGroupName] = useState("")

    useEffect(() => {

        if(userInfos) {
            console.log(userInfos);
            //Regarde si le user a le cours & est admin
            const has_course = userInfos.data.courses.filter(course => course.id === course_id && course.role === 'admin')
            if(has_course.length < 1) router.push('/app/select')


        }

    }, [userInfos])

    const handleAddTimeSlot = () => {
        if(!validateEmpty(newGroupTimeSlotPlace)) {
            return setErrors('Veuillez inscrire un local pour le cours.')
        }
        if(!validateEmpty(newGroupTimeSlotHourFrom)) {
            return setErrors('Veuillez inscrire une heure de début pour le cours.')
        }
        if(!validateEmpty(newGroupTimeSlotHourTo)) {
            return setErrors('Veuillez inscrire une heure de fin pour le cours.')
        }

        const from = {
            h: parseInt(newGroupTimeSlotHourFrom.split(':')[0]),
            m: parseInt(newGroupTimeSlotHourFrom.split(':')[1])
        }
        const to = {
            h: parseInt(newGroupTimeSlotHourTo.split(':')[0]),
            m: parseInt(newGroupTimeSlotHourTo.split(':')[1])
        }
        
        if(from.h > to.h) {
            return setErrors('Heure de début invalide!')
        }
        if(from.h === to.h && from.m >= to.m) {
            return setErrors('Heure de début invalide!')
        }

        const data = {
            day: newGroupTimeSlotDay,
            place: newGroupTimeSlotPlace,
            time: {
                from : newGroupTimeSlotHourFrom,
                to: newGroupTimeSlotHourTo
            }
        }
        const times = [...newGroupTimeSlots]
        times.push(data)
        setNewGroupTimeSlots(times)

        return data
    }

    const handleAddMoreTimeSlot = () => {

        const data = handleAddTimeSlot()
        console.log(data);
        if(data !== undefined) {
            
            //reset states for new time slot
            setNewGroupTimeSlotDay("monday")
            setNewGroupTimeSlotPlace("")
            setNewGroupTimeSlotHourFrom("")
            setNewGroupTimeSlotHourTo("")
        }

    }

    const handleEditTimeSlot = (x) => {
        
        const slots = [...newGroupTimeSlots]
        const slot = slots[x]
        setNewGroupTimeSlotDay(slot.day)
        setNewGroupTimeSlotPlace(slot.place)
        setNewGroupTimeSlotHourFrom(slot.time.from)
        setNewGroupTimeSlotHourTo(slot.time.to)

        setNewGroupTimeSlots(slots.filter((s,i) => i !== x))
    }

    const handleCreateGroup = () => {

    }


    return (
        <Layout
            pageTitle="Créer un groupe"
            navigationVisible={true}
            requiresCourse={false}
            onGetUserInfos={data => setUserInfos(data)}
            id="group-creator"
        >

            <section className="content-creator_container">
                <h1>Créer un groupe</h1>
                <div className="content-creator">

                    {
                        step === 0 ?
                        <>
                            <span className="input-label">Nom du groupe</span>
                            <Input type="text" value={newGroupName} onChange={data => setNewGroupName(data)} placeholder="Exemple: 1015" />
                            <div className="content-creator_buttons">
                                <button className="cta blue" onClick={() => setStep(1)}>Suivant</button>
                            </div>
                        </>
                        :
                        step === 1 ?
                        <>
                            {newGroupTimeSlots.length > 0 ?
                            <div className="content-creator_timeslots">
                                {
                                    newGroupTimeSlots.map((slot,x) => 
                                    <div className="content-creator_timeslot" key={x} onClick={() => handleEditTimeSlot(x)}>
                                        <span>{getDayName(slot.day)}</span>
                                        <i>({slot.time.from} à {slot.time.to})</i>
                                        <strong>{slot.place}</strong>
                                    </div>    
                                    )
                                }
                            </div> : null }
                            <div className="content-creator_schedules">
                                <span className="input-label">Jour du cours</span>
                                <span className="input-label">Local du cours</span>
                                <Input
                                    type="select"
                                    value={newGroupTimeSlotDay}
                                    onChange={data => setNewGroupTimeSlotDay(data)}
                                    placeholder="Jour"
                                    selectValues={[
                                        { value: 'monday', name: 'Lundi' },
                                        { value: 'tuesday', name: 'Mardi' },
                                        { value: 'wednesday', name: 'Mercredi' },
                                        { value: 'thursday', name: 'Jeudi' },
                                        { value: 'friday', name: 'Vendredi' },
                                        { value: 'saturday', name: 'Samedi' },
                                        { value: 'sunday', name: 'Dimanche' },
                                    ]}
                                />

                                <Input type="text" value={newGroupTimeSlotPlace} onChange={data => setNewGroupTimeSlotPlace(data)} placeholder="A-1234" />
                                
                                <span className="input-label">Heure de début du cours</span>
                                <span className="input-label">Heure de fin du cours</span>

                                <Input type="time" value={newGroupTimeSlotHourFrom} onChange={data => setNewGroupTimeSlotHourFrom(data)} placeholder="Heure" />
                                <Input type="time" value={newGroupTimeSlotHourTo} onChange={data => setNewGroupTimeSlotHourTo(data)} placeholder="Heure" />

                                <button className="content-creator_schedules-add" onClick={() => handleAddMoreTimeSlot()}>Ajouter une autre plage horaire</button>                    
                            </div> 
                            
                            
                            <div className="content-creator_buttons">
                                <button className="cta gray" onClick={() => setStep(0)}>Précédent</button>
                                <button className="cta blue" onClick={() => setStep(1)}>Terminé</button>
                            </div>
                        </>
                        :null
                    }


                </div>

            </section>
            <ErrorAlert onClick={() => setErrors("")} visible={validateEmpty(errors)} content={errors}/>


        </Layout>
    )
}
