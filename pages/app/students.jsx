import { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";

import Layout from "/components/Layout";
import { HiOutlineChat, HiOutlineTrash } from 'react-icons/hi'
import Modal from "/components/Modal";
import ErrorAlert from "/components/ErrorAlert";
import SuccessAlert from '/components/SuccessAlert'
import NoResults from "/components/NoResults";
import LoaderSmall from '/components/LoaderSmall'
import { getUsers } from "../../functions/user.db";
import QRCode from "react-qr-code";

export default function students() {

    const router = useRouter()

    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(true)

    const [modalVisible, setModalVisible] = useState(false)
    const [modalScreen, setModalScreen] = useState("add")
    const [modalTitle, setModalTitle] = useState("")
    const [modalDesc, setModalDesc] = useState("")

    const [groupInfos, setGroupInfos] = useState(null)
    const [courseStudents, setCourseStudents] = useState(null)

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

        if(groupInfos) {
            const list = groupInfos.group.data.students
            if(list.length > 0) {
                getUsers(list)
                .then(users => {
                    setCourseStudents(users)
                    setLoading(false)
                })
            }else{
                setLoading(false)
            }

        }

    }, [groupInfos])

    /***
     *                                                                             
     *      ####  ##### #    # #####  ###### #    # #####    #      #  ####  ##### 
     *     #        #   #    # #    # #      ##   #   #      #      # #        #   
     *      ####    #   #    # #    # #####  # #  #   #      #      #  ####    #   
     *          #   #   #    # #    # #      #  # #   #      #      #      #   #   
     *     #    #   #   #    # #    # #      #   ##   #      #      # #    #   #   
     *      ####    #    ####  #####  ###### #    #   #      ###### #  ####    #   
     *                                                                             
     */
    const StudentsList = () => {

        if(courseStudents.length < 1) return <NoResults/>
        return(
            <ul className="students-list">
                <li className="students-list_header students-list_item">
                    <div className="students-list_item-section section-name">Nom</div>
                    <div className="students-list_item-section section-email">Adresse courriel</div>
                    <div className="students-list_item-section section-actions">Actions</div>
                </li>
                {
                    courseStudents.map(user =>
                        <li className="students-list_item" key={user.id}>
                            <div className="students-list_item-section section-name">{ user.data.name }</div>
                            <div className="students-list_item-section section-email">{ user.data.email }</div>
                            <div className="students-list_item-section section-actions">
                                <button type="button" className="students-list_item-action">
                                    <HiOutlineChat />
                                </button>
                                <button type="button" className="students-list_item-action">
                                    <HiOutlineTrash />
                                </button>
                            </div>
                        </li>
                    )
                }
            </ul>
        )
        
    }

    /***
     *                                                
     *       ##    ####  ##### #  ####  #    #  ####  
     *      #  #  #    #   #   # #    # ##   # #      
     *     #    # #        #   # #    # # #  #  ####  
     *     ###### #        #   # #    # #  # #      # 
     *     #    # #    #   #   # #    # #   ## #    # 
     *     #    #  ####    #   #  ####  #    #  ####  
     *                                                
     */

    

    return (
        <Layout
            pageTitle="??l??ves"
            id="students"
            currentPage="students"
            navigationVisible={true}
            requiresCourse={true}
            onGetGroupInfos={(data) => setGroupInfos(data)}
        >
            
            <div className="students-overview default-page">
                <div className="section-header">
                    <h1>??l??ves</h1>
                    <div className="section-header_buttons">
                        <button className="cta blue" onClick={() => {
                            setModalScreen("add")
                            setModalDesc("Faites entrer le code ci-dessous par vous ??l??ves ou faites leur scannez le code pour rejoindre le groupe.")
                            setModalTitle("Ajouter des ??l??ves")
                            setModalVisible(true)
                        }}>Ajouter</button>
                    </div>
                </div>

                {
                    loading ? <LoaderSmall/> :
                    courseStudents ? <StudentsList/> : <NoResults />
                }
            </div>

            <Modal
                title={modalTitle}
                visible={modalVisible}
                description={modalDesc}
                id="students-modal"
                onExit={() => setModalVisible(false)}
            >

                {
                    modalScreen === "add" ?
                        <div className="students-join">
                            <div className="students-join_qrcode">
                                {
                                    groupInfos ? <QRCode value={groupInfos.group.data.join_code} /> : <LoaderSmall/>
                                }
                            </div>
                            {
                                groupInfos ? <h2>{groupInfos.group.data.join_code}</h2> : null
                            }
                            <div className="main-modal_buttons">
                                <button className="cta gray" onClick={() => setModalVisible(false)}>Termin??</button>
                            </div>
                        </div>
                    : null
                }

            </Modal>

        </Layout>
    )
}
