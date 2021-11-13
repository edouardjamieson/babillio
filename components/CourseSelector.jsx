import Link from "next/link";
import { useEffect, useState } from "react";
import { getCourseInfos } from "../functions/course.db";

import Loader from './Loader'
export default function CourseSelector({ user }) {

    const [loading, setLoading] = useState(true)
    const [userCourses, setUserCourses] = useState(null)


    useEffect(() => {
        
        if(user.data().hasOwnProperty('courses') && user.data().courses.length > 0) {
            //fetch user's course
            const courses = user.data().courses.filter(c => c.role === 'admin').map(c => c.id)
            
            getCourseInfos(courses)
            .then(c => setUserCourses(c))
            .then(() => setLoading(false))
        }else{
            setLoading(false)
        }

    }, [])

    const SingleCourse = ({course}) => {
        return (
            <li className="course-selector_item" key={course.id}>
                <div className="course-selector_item-head">
                    <span>{course.data.icon}</span>
                    <h2>{course.data.name}</h2>
                    <p className="course-selector_item-dates">
                        du <strong>{ new Date(course.data.dates.from).toLocaleDateString() }</strong> au <strong>{ new Date(course.data.dates.to).toLocaleDateString() }</strong>
                    </p>
                </div>
                <div className="course-selector_item-groups">
                    { course.data.hasOwnProperty('groups') && course.data.groups.length > 0 ?
                        <span>yo</span>
                        :
                        <button type='button' className='cta white'>Créer un groupe</button>
                    }
                </div>
            </li>
        )
    }

    if(loading) return <Loader/>

    if(user.data().type === "teacher") {

        return (
            <section className="course-selector">
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
                            userCourses.map(course => <SingleCourse course={course}/>)
                        }
                    </ul>
                </div>
                
                }
    
    
    
            </section>
        )

    }


    if(user.data().type === "student") {



        return (
            <section className="course-selector">
                { !user.data().hasOwnProperty('courses') || user.data().courses.length === 0 ?
                
                <div className="no-course">
                    <h1>Vous n’avez pas encore rejoint de cours!</h1>
                    <p>Rejoingnez un cours en scannant le un code QR de cour ou en entrant un code de cours</p>
                    <Link href="/join">
                        <a className="cta blue">Rejoindre un cours</a>
                    </Link>
                    <div className="no-course_bg"></div>
                </div>
                
                : <h1>xd</h1> }
    
    
    
            </section>
        )
    }
}
