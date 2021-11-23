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
import QRCode from "react-qr-code";
import { getGroupCode } from "../../functions/code.db";

export default function students() {

    const router = useRouter()

    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(true)

    const [modalVisible, setModalVisible] = useState(true)
    const [modalScreen, setModalScreen] = useState("add")
    const [modalTitle, setModalTitle] = useState("Ajouter des élèves")
    const [modalDesc, setModalDesc] = useState("Faites entrer le code ci-dessous par vous élèves pour rejoindre le groupe.")

    const [groupInfos, setGroupInfos] = useState(null)
    const [courseStudents, setCourseStudents] = useState([])

    const StudentsList = () => {

        if(courseStudents.length < 1) return <NoResults/>
        
    }

    const GroupCode = () => {

        // const code = 


    }

    useEffect(() => {

        if(groupInfos) {
            const list = groupInfos.group.students
            getUsers(list)
            .then(users => {
                setCourseStudents(users)
                setLoading(false)
            })

            getGroupCode(groupInfos.course.id, groupInfos.group.name)


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

            <Modal
                title={modalTitle}
                visible={modalVisible}
                description={modalDesc}
                id="students-modal"
            >

                {
                    modalScreen === "add" ?
                        <>
                            <QRCode value="https://babillio.com/api/hello" />
                            <div className="main-modal_buttons">
                                <button className="cta gray">Terminé</button>
                            </div>
                        </>
                    : null
                }

            </Modal>

        </Layout>
    )
}
