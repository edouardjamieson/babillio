import Layout from "/components/Layout"
import Link from "next/link";
import Loader from '/components/Loader'

import { useEffect, useState } from "react";
import { getCourseInfos } from "/functions/course.db";
import { setCurrentGroup } from "../../functions/groups.db";
import { validateEmpty } from "/functions/utils";
import ErrorAlert from "/components/ErrorAlert";
import { useRouter } from "next/dist/client/router";
import { HiOutlinePlusSm, HiOutlineUsers } from "react-icons/hi";

export default function select() {

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [errors, setErrors] = useState("")

    const [userInfos, setUserInfos] = useState(null)
    const [userCourses, setUserCourses] = useState(null)


    /***
     *                                              
     *     ###### ###### ###### ######  ####  ##### 
     *     #      #      #      #      #    #   #   
     *     #####  #####  #####  #####  #        #   
     *     #      #      #      #      #        #   
     *     #      #      #      #      #    #   #   
     *     ###### #      #      ######  ####    #   
     *                                              
     */
    useEffect(() => {

        if(userInfos) {

            if(userInfos.data.courses.length > 0) {

                //fetch courses
                const courses = userInfos.data.courses
                .filter(course => course.role === userInfos.data.type === "teacher" ? "admin" : "default")
                .map(course => course.id)

                getCourseInfos(courses)
                .then(courses => setUserCourses(courses))
                .then(() => setLoading(false))

            }else{
                setLoading(false)
            }

        }        

    }, [userInfos])

    /***
     *                                                                                    
     *      ####  ###### #      ######  ####  #####     ####  #####   ####  #    # #####  
     *     #      #      #      #      #    #   #      #    # #    # #    # #    # #    # 
     *      ####  #####  #      #####  #        #      #      #    # #    # #    # #    # 
     *          # #      #      #      #        #      #  ### #####  #    # #    # #####  
     *     #    # #      #      #      #    #   #      #    # #   #  #    # #    # #      
     *      ####  ###### ###### ######  ####    #       ####  #    #  ####   ####  #      
     *                                                                                    
     */
    const handleSelectGroup = (course_id, group_id) => {

        setCurrentGroup(course_id, group_id)
        .then(r => {
            const gobackurl = router.query.gobackto || '/app'
            router.push(gobackurl)
        })

    }


    /***
     *                                                                        
     *      ####   ####  #    # #####   ####  ######    #      #  ####  ##### 
     *     #    # #    # #    # #    # #      #         #      # #        #   
     *     #      #    # #    # #    #  ####  #####     #      #  ####    #   
     *     #      #    # #    # #####       # #         #      #      #   #   
     *     #    # #    # #    # #   #  #    # #         #      # #    #   #   
     *      ####   ####   ####  #    #  ####  ######    ###### #  ####    #   
     *                                                                        
     */
    const SingleTeacherCourse = ({data}) => {
        console.log(data);
        return (
            <li className="course-selector_item">
                <div className="course-selector_item-head">
                    <span>{data.course.data.icon}</span>
                    <h2>{data.course.data.name}</h2>
                    <p className="course-selector_item-dates">
                        du <strong>{ new Date(data.course.data.dates.from).toLocaleDateString() }</strong> au <strong>{ new Date(data.course.data.dates.to).toLocaleDateString() }</strong>
                    </p>
                </div>
                { data.groups.length > 0 ?
                    <div className="course-selector_item-groups">
                        {data.groups.map(group => 
                            <button className="course-selector_item-group" key={group.data.name} onClick={() => handleSelectGroup(data.course.id, group.id)}>
                                <span>gr.</span>
                                <h4>{group.data.name}</h4>
                                <div>
                                    <HiOutlineUsers />
                                    <span>{group.data.students.length}</span>
                                </div>
                            </button>
                        )}
                        <button className="course-selector_add-group" onClick={() => router.push(`/app/create/group?course=${data.course.id}`)}><HiOutlinePlusSm /></button>
                    </div>
                    :
                    <div style={{marginTop:"1rem"}}>
                        <button type='button' className='cta white' onClick={() => router.push(`/app/create/group?course=${data.course.id}`)}>Créer un groupe</button>
                    </div>
                }
            </li>
        )
    }

    const SingleStudentCourse = ({data}) => {
        console.log(data);
        return (
            <li className="course-selector_item student-item" onClick={() => handleSelectGroup(data.course.id, data.group.id)}>
                <div className="course-selector_item-head">
                    <span>{data.course.data.icon}</span>
                    <h2>{data.course.data.name}</h2>
                    <p className="course-selector_item-dates">gr.{data.group.data.name}</p>
                </div>
                <div className="course-selector_item-groups">
                    <div className="course-selector_item-group">
                        <span>Travaux</span>
                        <h4>{data.group.data.works.length}</h4>
                    </div>
                    <div className="course-selector_item-group">
                        <span>Documents</span>
                        <h4>1</h4>
                    </div>
                    <div className="course-selector_item-group">
                        <span>Élèves</span>
                        <h4>{data.group.data.students.length}</h4>
                    </div>
                </div>
            </li>
        )
    }

    return (
        <Layout
            pageTitle="Choisir un cours"
            navigationVisible={true}
            onGetUserInfos={data => setUserInfos(data)}
        >
            {
                loading ? <Loader /> :

                <section className="course-selector default-page">

                    {
                        userInfos.data.type === "teacher" ?
                            userCourses ?
                            <div className="course-selector_container">
                                <div className="section-header">
                                    <h1>Choisir un cours</h1>
                                    <div className="section-header_buttons">
                                        <Link href='/app/create/course'>
                                            <a className="cta gray">Créer un cours</a>
                                        </Link>
                                    </div>
                                </div>
                                <ul className="course-selector_list">
                                    {
                                        userCourses.map(data => <SingleTeacherCourse key={data.course.id} data={data}/>)
                                    }
                                </ul>
                            </div>
                            :
                            <div className="no-course">
                                <h1>Vous n’avez pas encore créé de cours!</h1>
                                <p>Créer votre premier cours en appuyant sur le bouton ci-dessous.</p>
                                <Link href="/app/create/course">
                                    <a className="cta blue">Créer un cours</a>
                                </Link>
                                <div className="no-course_bg"></div>
                            </div>
                        :
                            userCourses ?
                            <div className="course-selector_container default-page">
                                <div className="section-header">
                                    <h1>Choisir un cours</h1>
                                    <div className="section-header_buttons">
                                        <Link href='/app/join'>
                                            <a className="cta gray">Rejoindre un cours</a>
                                        </Link>
                                    </div>
                                </div>
                                <ul className="course-selector_list">
                                    {
                                        userCourses.map(data => <SingleStudentCourse key={data.course.id} data={data}/>)
                                    }
                                </ul>
                            </div>
                            :
                            <div className="no-course">
                                <h1>Vous n’avez pas encore rejoint de cours!</h1>
                                <p>Rejoingnez votre premier cours en appuyant sur le bouton ci-dessous.</p>
                                <Link href="/app/join">
                                    <a className="cta blue">Rejoindre un cours</a>
                                </Link>
                                <div className="no-course_bg"></div>
                            </div>
                    }

                </section>
            }

            <ErrorAlert onClick={() => setErrors("")} visible={validateEmpty(errors)} content={errors}/>
        </Layout>
    )
}