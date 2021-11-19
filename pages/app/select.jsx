import Layout from "/components/Layout"
import Link from "next/link";
import Loader from '/components/Loader'

import { useEffect, useState } from "react";
import { addGroupToCourse, getCourseInfos, setCurrentGroup } from "/functions/course.db";
import { getAuth, getLoggedUser, getUserByID } from "/functions/user.db";
import { auth } from "/functions/firebase";
import Modal from "/components/Modal";
import { validateEmpty } from "/functions/utils";
import ErrorAlert from "/components/ErrorAlert";
import { useRouter } from "next/dist/client/router";

export default function select() {

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [userCourses, setUserCourses] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")
    const [newGroupCourseID, setNewGroupCourseID] = useState("")
    const [errors, setErrors] = useState("")



    useEffect(() => {


        auth.onAuthStateChanged(u => {
            getUserByID(u.uid)
            .then(value => {setUser(value); return value })
            .then((user) => {
                if(user.data().hasOwnProperty('courses') && user.data().courses.length > 0) {
                    //fetch user's course
                    const courses = user.data().courses.filter(c => c.role === 'admin').map(c => c.id)
                    
                    getCourseInfos(courses)
                    .then(c => setUserCourses(c))
                    .then(() => setLoading(false))
                }else{
                    setLoading(false)
                }
            })

        })
        

    }, [])

    const SingleTeacherCourse = ({course}) => {
        return (
            <li className="course-selector_item">
                <div className="course-selector_item-head">
                    <span>{course.data.icon}</span>
                    <h2>{course.data.name}</h2>
                    <p className="course-selector_item-dates">
                        du <strong>{ new Date(course.data.dates.from).toLocaleDateString() }</strong> au <strong>{ new Date(course.data.dates.to).toLocaleDateString() }</strong>
                    </p>
                </div>
                { course.data.hasOwnProperty('groups') && course.data.groups.length > 0 ?
                    <div className="course-selector_item-groups">
                        {course.data.groups.map(group => 
                            <button className="course-selector_item-group" key={group.name} onClick={() => handleSelectGroup(course.id, group)}>
                                <span>gr.</span>
                                <h4>{group.name}</h4>
                                <div>
                                    <i className="icon-users"></i>
                                    <span>{group.students.length}</span>
                                </div>
                            </button>
                        )}
                        <button className="course-selector_add-group" onClick={() => {setNewGroupCourseID(course.id); setModalVisible(true)}}>+</button>
                    </div>
                    :
                    <div style={{marginTop:"1rem"}}>
                        <button type='button' className='cta white' onClick={() => {setNewGroupCourseID(course.id); setModalVisible(true)}}>Créer un groupe</button>
                    </div>
                }
            </li>
        )
    }

    const handleAddGroup = () => {

        if(!validateEmpty(newGroupName)) {
            setModalVisible(false)
            return setErrors("Veuillez entrez un nom valide pour le groupe")
        }

        const data = {
            name: newGroupName,
            created_at: Date.now(),
            admin: user.id,
            students: [],
            works:[],
        }

        addGroupToCourse(newGroupCourseID, data)
        .then(r => {
            router.reload()
        })

    }

    const handleSelectGroup = (course_id, data) => {

        setCurrentGroup(course_id, data)
        .then(r => {
            const gobackurl = router.query.gobackto || '/app'
            router.push(gobackurl)
        })

    }

    if(loading === true || user === null) return <Loader/>

    if(user.data().type === "teacher") {
        return (
            <Layout
                pageTitle="Choisir un cours"
                navigationVisible={true}
            >
                <section className="course-selector default-page">
                    { !user.data().hasOwnProperty('courses') || user.data().courses.length === 0 ?
                    
                    <div className="no-course">
                        <h1>Vous n’avez pas encore créé de cours!</h1>
                        <p>Créer votre premier cours en appuyant sur le bouton ci-dessous.</p>
                        <Link href="/create">
                            <a className="cta blue">Créer un cours</a>
                        </Link>
                        <div className="no-course_bg"></div>
                    </div>
                    
                    :
                    <div className="course-selector_container">
                        <div className="section-header">
                            <h1>Choisir un cours</h1>
                            <div className="section-header_buttons">
                                <Link href='/create'>
                                    <a className="cta gray">Créer un cours</a>
                                </Link>
                            </div>
                        </div>
                        <ul className="course-selector_list">
                            {
                                userCourses.map(course => <SingleTeacherCourse key={course.id} course={course}/>)
                            }
                        </ul>
                    </div>
                    
                    }
    
    
    
                </section>

                <ErrorAlert onClick={() => setErrors("")} visible={validateEmpty(errors)} content={errors}/>

                <Modal
                    title="Créer un nouveau groupe"
                    visible={modalVisible}
                    description="Saisissez le nom ou numéro du nouveau groupe d'élèves"
                >  
                    <div className="input-container">
                        <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} type="text" placeholder=" " className="input-container_input" />
                        <span className="input-container_label">Ex : 1100</span>
                    </div>  
                    <div className="main-modal_buttons">
                        <button className="cta gray" onClick={() => setModalVisible(false)}>Annuler</button>
                        <button className="cta blue" onClick={() => handleAddGroup()}>Ajouter</button>
                    </div>

                </Modal>
            </Layout>
        )
    }

    if(user.data().type === "student") {
        return (
            <Layout
                pageTitle="Choisir un cours"
                navigationVisible={true}
            >
                <section className="course-selector">
                    { !user.data().hasOwnProperty('courses') || user.data().courses.length === 0 ?
                    
                    <div className="no-course">
                        <h1>Vous n’avez pas encore rejoint de cours!</h1>
                        <p>Rejoingnez votre premier cours en appuyant sur le bouton ci-dessous.</p>
                        <Link href="/join">
                            <a className="cta blue">Rejoindre un cours</a>
                        </Link>
                        <div className="no-course_bg"></div>
                    </div>
                    
                    :
                    <div className="course-selector_container">
                        <div className="section-header">
                            <h1>Choisir un cours</h1>
                            <div className="section-header_buttons">
                                <Link href='/create'>
                                    <a className="cta gray">Créer un cours</a>
                                </Link>
                            </div>
                        </div>
                        <ul className="course-selector_list">
                            {
                                userCourses.map(course => <SingleTeacherCourse key={course.id} course={course}/>)
                            }
                        </ul>
                    </div>
                    
                    }
    
    
    
                </section>

                <ErrorAlert onClick={() => setErrors("")} visible={validateEmpty(errors)} content={errors}/>

                <Modal
                    title="Créer un nouveau groupe"
                    visible={modalVisible}
                    description="Saisissez le nom ou numéro du nouveau groupe d'élèves"
                >  
                    <div className="input-container">
                        <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} type="text" placeholder=" " className="input-container_input" />
                        <span className="input-container_label">Ex : 1100</span>
                    </div>  
                    <div className="main-modal_buttons">
                        <button className="cta gray" onClick={() => setModalVisible(false)}>Annuler</button>
                        <button className="cta blue" onClick={() => handleAddGroup()}>Ajouter</button>
                    </div>

                </Modal>
            </Layout>
        )
    }
}
