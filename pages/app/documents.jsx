import { useEffect, useState } from "react";
import Layout from "/components/Layout";
import CurrentGroupBanner from "/components/CurrentGroupBanner";
import Modal from "/components/Modal";
import ErrorAlert from "/components/ErrorAlert";
import SuccessAlert from '/components/SuccessAlert'
import { generateUniqueID, validateEmpty } from "/functions/utils";
import { auth, storage } from "/functions/firebase";
import { addCourseFiles, courseFileAddGroup, courseFileRemoveGroup, deleteFile, getCourseFiles } from "/functions/course.db";
import NoResults from "/components/NoResults";
import LoaderSmall from '/components/LoaderSmall'

import { HiDownload, HiOutlineEyeOff, HiOutlineTrash, HiUpload } from 'react-icons/hi'
import { useRouter } from "next/dist/client/router";

export default function documents() {

    const router = useRouter()

    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(true)

    const [modalVisible, setModalVisible] = useState(false)
    const [modalScreen, setModalScreen] = useState("add")
    const [modalTitle, setModalTitle] = useState("Ajouter un document")
    const [modalDesc, setModalDesc] = useState("")
    
    const [groupInfos, setGroupInfos] = useState(null)
    const [courseFiles, setCourseFiles] = useState([])

    const [documentUploadFiles, setDocumentUploadFiles] = useState([])
    const [documentUploadURL, setDocumentUploadURL] = useState("")
    const [documentUploadErrors, setDocumentUploadErrors] = useState("")
    const [documentActionsID, setDocumentActionsID] = useState("")

    /***
     *                                                                                                   
     *     #    # #####  #       ####    ##   #####     #    #   ##   #    #   ##    ####  ###### #####  
     *     #    # #    # #      #    #  #  #  #    #    ##  ##  #  #  ##   #  #  #  #    # #      #    # 
     *     #    # #    # #      #    # #    # #    #    # ## # #    # # #  # #    # #      #####  #    # 
     *     #    # #####  #      #    # ###### #    #    #    # ###### #  # # ###### #  ### #      #####  
     *     #    # #      #      #    # #    # #    #    #    # #    # #   ## #    # #    # #      #   #  
     *      ####  #      ######  ####  #    # #####     #    # #    # #    # #    #  ####  ###### #    # 
     *                                                                                                   
     */
    
    // ====================================================================
    // Adds new file to upload list
    // ====================================================================
    const handleAddDocument = (e) => {
        const files = e.target.files
        const types = ["doc", "docx", "txt", "pdf", "ppt", "pptx", "xlsx", "xls"]

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            //Check if there's duplicates
            const name = file.name

            //Check type
            let type = file.name.split('.')
            type = type[type.length-1].toLowerCase()
            if(!types.includes(type)) {
                return setDocumentUploadErrors("Ce type de fichier n'est pas supporté.")
            }

            //Check size
            const size_in_bytes = file.size
            const size_in_mb = size_in_bytes/1000000
            if(size_in_mb > 10) {
                return setDocumentUploadErrors("Ce fichier dépasse la taille maximale de 10MB.")
            }

            setDocumentUploadFiles(file)
            
        }

        
    }

    // ====================================================================
    // Uploads file to cloud from url or file and updates DB
    // ====================================================================
    const handleUploadDocuments = () => {

        if(documentUploadFiles.length < 1){
            return setDocumentUploadErrors("Veuillez selectionner au moins un fichier ou entrer une URL.")
        }
        
        addCourseFiles(groupInfos.course.id, auth.currentUser.uid, documentUploadFiles, groupInfos.group.id)
        .then(new_file => {
            setDocumentUploadFiles([])
            setDocumentUploadErrors("")
            setDocumentUploadURL("")

            const files = [...courseFiles]
            files.unshift(new_file)
            handleProcessCourseFiles(files, 'desc')
            
            setModalVisible(false)
            setSuccess(`Fichier téléversé et ajouté à ce groupe.`)
        })

    }

    // ====================================================================
    // Updates DB to add this group to file visible list
    // ====================================================================
    const handleUploadFromPastDocument = (doc) => {

        courseFileAddGroup(groupInfos.course.id, groupInfos.group.name, doc)
        .then(() => {
            setDocumentUploadFiles([])
            setDocumentUploadErrors("")
            setDocumentUploadURL("")
            setModalVisible(false)
            setSuccess(`Le fichier "${doc.data.original_name}" a été ajouté à ce groupe.`)
        })

    }

    /***
     *                                                            
     *     ###### # #      ######  ####     #      #  ####  ##### 
     *     #      # #      #      #         #      # #        #   
     *     #####  # #      #####   ####     #      #  ####    #   
     *     #      # #      #           #    #      #      #   #   
     *     #      # #      #      #    #    #      # #    #   #   
     *     #      # ###### ######  ####     ###### #  ####    #   
     *                                                            
     */

    // ====================================================================
    // Gets all documents from course where this group is not included
    // ====================================================================
    const PastDocuments = () => {
        const not_this_group_docs = courseFiles.filter(doc => !doc.data.groups.includes(groupInfos.group.id))

        if(courseFiles.length < 1 || not_this_group_docs.length < 1) return null
        return (

            <div className="uploader-past_documents">
                <h3>Documents récents</h3>
                {
                    not_this_group_docs.map(doc =>
                        <button className="uploader-past_document" key={doc.id} onClick={() => { handleUploadFromPastDocument(doc) }}>
                            <h4>{doc.data.original_name}</h4>
                            <span>Ajouté le</span>
                            <i>{new Date(doc.data.created_at).toLocaleDateString()}</i>
                        </button>
                    )

                }
            </div>
        )
    }

    // ====================================================================
    // Gets all documents from course where this group is included
    // ====================================================================
    const DocumentsList = () => {
        const this_group_docs = courseFiles.filter(doc => doc.data.groups.includes(groupInfos.group.id))
        if(this_group_docs.length < 1) return <NoResults/>

        return (
            <div className="documents-list">
                {this_group_docs.map(doc => 
                    <div className="single_document" key={doc.id}>
                        <div className="single_document-content">
                            <h3 className="single_document-name">{doc.data.original_name}</h3>
                            <span className="single_document-date">{new Date(doc.data.created_at).toLocaleDateString()}</span>
                            <div className="single_document-actions">
                                <button className="single_document-action" onClick={() => handleDownloadDocument(doc.data.url)}>
                                    <HiDownload />
                                    <span className="label">Télécharger</span>
                                </button>
                                <button className="single_document-action" onClick={() => {
                                    setDocumentActionsID(doc.id)
                                    setModalScreen('hide')
                                    setModalTitle(`Cacher ce fichier ?`)
                                    setModalDesc(`Cacher "${doc.data.original_name}" entraînera sa perte sur ce groupe seulement, si vous souhaitez supprimer défintivement ce fichier, choisissez l'option "Supprimer ce fichier".`)
                                    setModalVisible(true)
                                }}>
                                    <HiOutlineEyeOff />
                                    <span className="label">Cacher</span>
                                </button>
                                <button className="single_document-action trash-action" onClick={() => {
                                    setDocumentActionsID(doc.id)
                                    setModalScreen('delete')
                                    setModalTitle(`Supprimer ce fichier ?`)
                                    setModalDesc(`Supprimer "${doc.data.original_name}" entraînera sa perte sur l'entièrté de vos groupes pour ce cours. Cette action est irriversible. Si vous souhaitez simplement supprimer ce fichier de ce groupe, choisissez l'option "Cacher ce fichier".`)
                                    setModalVisible(true)
                                }}>
                                    <HiOutlineTrash />
                                    <span className="label">Supprimer</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

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

    // ====================================================================
    // Deletes file from cloud & DB
    // ====================================================================
    const handleDeleteFile = () => {

        const url = courseFiles.filter(file => file.id === documentActionsID)[0].data.url

        deleteFile(groupInfos.course.id, documentActionsID, url)
        .then(() => {
            router.reload()
        })

    }

    // ====================================================================
    // Removes this group from file visible list
    // ====================================================================
    const handleHideFile = () => {
        const group_id = groupInfos.group.id

        courseFileRemoveGroup(groupInfos.course.id, group_id, documentActionsID)
        .then(() => {

            let files = [...courseFiles]
            files = files.filter(file => file.id !== documentActionsID)
            setCourseFiles(files)

            setModalVisible(false)
            setSuccess(`Le fichier a bien été retiré de ce groupe.`)

        })

    }

    // ====================================================================
    // Downloads file
    // ====================================================================
    const handleDownloadDocument = (url) => {
        window.open(url, '_blank')
    }

    /***
     *                                                
     *      ####   ####  #####  #####    #####  #   # 
     *     #      #    # #    #   #      #    #  # #  
     *      ####  #    # #    #   #      #####    #   
     *          # #    # #####    #      #    #   #   
     *     #    # #    # #   #    #      #    #   #   
     *      ####   ####  #    #   #      #####    #   
     *                                                
     */

    const handleProcessCourseFiles = (files, orderby) => {


        let ordered
        if(orderby === 'desc') {
            ordered = files.sort((a,b) => b.data.created_at - a.data.created_at)
        }

        setCourseFiles(ordered)
        setLoading(false)

    }

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
            console.log(groupInfos);

            getCourseFiles(groupInfos.course.id)
            .then(files => {
                handleProcessCourseFiles(files.map(f => ({ id:f.id, data:f.data() })), 'desc')
            })

        }

    }, [groupInfos])


    return (
        <Layout pageTitle="Documents" id="documents" currentPage="documents" navigationVisible={true} requiresCourse={true} onGetGroupInfos={(data) => setGroupInfos(data)}>

            <div className="documents-overview default-page">
                <div className="section-header">
                    <h1>Documents</h1>
                    <div className="section-header_buttons">
                        <button className="cta blue" onClick={() => { setModalScreen('add'); setModalTitle("Ajouter un document"); setModalVisible(true) }}>Ajouter</button>
                    </div>
                </div>
                {
                    loading ? <LoaderSmall/> : <DocumentsList/>
                }
            </div>

            <Modal
                title={modalTitle}
                visible={modalVisible}
                id="documents-modal"
                description={modalDesc}
            >

                { modalScreen === "add" ?
                    <>
                        <div className="uploader-container">
                            <input type="file" onChange={e => handleAddDocument(e)} id="document-uploader" name="document" className="uploader-container_input" />
                            <label htmlFor="document-uploader" className="uploader-container_label">
                                {
                                    documentUploadFiles.length < 1 ?
                                    <>
                                        <HiUpload/>
                                        <span>Cliquez ici pour selectionner un document</span>
                                    </>:
                                    <span>{documentUploadFiles.name}</span>
                                }
                                
                            </label>
                        </div>
                        <div className="input-container">
                            <input value={documentUploadURL} onChange={e => setDocumentUploadURL(e.target.value)} type="text" placeholder=" " className="input-container_input" />
                            <span className="input-container_label">Ou saisissez une url</span>
                        </div>  
                        { groupInfos ?
                        <PastDocuments/> : null }
                        <div className="main-modal_buttons">
                            <button className="cta gray" onClick={() => {setModalVisible(false); setDocumentUploadFiles([])}}>Annuler</button>
                            <button className="cta blue" onClick={() => handleUploadDocuments()}>Ajouter</button>
                        </div>
                        <ErrorAlert visible={validateEmpty(documentUploadErrors)} content={documentUploadErrors} onClick={() => setDocumentUploadErrors("")} />
                    </>
                
                : modalScreen === "delete" ?
                    <div className="main-modal_buttons">
                        <button className="cta gray" onClick={() => {setModalVisible(false); setDocumentActionsID("")}}>Annuler</button>
                        <button className="cta red" onClick={() => handleDeleteFile()}>Supprimer</button>
                    </div>
                : modalScreen === "hide" ?
                    <div className="main-modal_buttons">
                        <button className="cta gray" onClick={() => {setModalVisible(false); setDocumentActionsID("")}}>Annuler</button>
                        <button className="cta red" onClick={() => handleHideFile()}>Cacher</button>
                    </div>
                :null
                }

            </Modal>
            <SuccessAlert visible={validateEmpty(success)} content={success} onClick={() => setSuccess("")} />


        </Layout>
    )
}
