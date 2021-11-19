import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";

import Layout from "/components/Layout";
import CurrentGroupBanner from "/components/CurrentGroupBanner";
import Modal from "/components/Modal";
import ErrorAlert from "/components/ErrorAlert";
import SuccessAlert from '/components/SuccessAlert'
import NoResults from "/components/NoResults";
import LoaderSmall from '/components/LoaderSmall'
import { getUsers } from "../../functions/user.db";

export default function students() {

    const router = useRouter()

    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(true)

    const [groupInfos, setGroupInfos] = useState(null)
    const [courseStudents, setCourseStudents] = useState([])

    const StudentsList = () => {

        if(courseStudents.length < 1) return <NoResults/>
        
    }

    useEffect(() => {

        if(groupInfos) {
            const list = groupInfos.group.students
            getUsers(list)
            .then(users => {
                setCourseStudents(users)
                setLoading(false)
            })


        }

    }, [groupInfos])

    return (
        <Layout pageTitle="Élèves" id="students" currentPage="students" navigationVisible={true} requiresCourse={true} onGetGroupInfos={(data) => setGroupInfos(data)}>
            
            <div className="students-overview default-page">
                <div className="section-header">
                    <h1>Élèves</h1>
                    <div className="section-header_buttons">
                        <button className="cta blue">Ajouter</button>
                    </div>
                </div>

                {
                    loading ? <LoaderSmall/> : <StudentsList/>
                }
            </div>

        </Layout>
    )
}
