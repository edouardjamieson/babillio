import { useEffect, useState } from "react"
import Input from "../../../components/Input"
import Layout from "../../../components/Layout"
import Uploader from "../../../components/Uploader"
import ErrorAlert from '/components/ErrorAlert'
import LoaderSmall from '../../../components/LoaderSmall'
import { validateEmpty } from "../../../functions/utils"
import { HiOutlineCheck, HiOutlineDocumentDuplicate, HiOutlineLink, HiOutlinePencil, HiOutlineSave } from "react-icons/hi"
import { getCategories, getGroupFiles, uploadFile } from '../../../functions/content.db'
import Drawer from "../../../components/Drawer"

export default function file() {

    const [userInfos, setUserInfos] = useState(null)
    const [groupInfos, setGroupInfos] = useState(null)

    const [groupFiles, setGroupFiles] = useState(null)
    const [categories, setCategories] = useState([])

    const [step, setStep] = useState(2)
    const [error, setError] = useState("")
    const [newContentMethod, setNewContentMethod] = useState("files")

    const [newContentFiles, setNewContentFiles] = useState([])
    const [newContentFilesUploadData, setNewContentFilesUploadData] = useState({})
    const [newContentURL, setNewContentURL] = useState("")
    const [newContentPublication, setNewContentPublication] = useState("")
    const [newContentPastContent, setNewContentPastContent] = useState([])
    const [newContentAvailableDate, setNewContentAvailableDate] = useState(new Date().toLocaleDateString())
    const [newContentAvailableTime, setNewContentAvailableTime] = useState("12:00")

    /***
     *                                   
     *     ###### # #      ######  ####  
     *     #      # #      #      #      
     *     #####  # #      #####   ####  
     *     #      # #      #           # 
     *     #      # #      #      #    # 
     *     #      # ###### ######  ####  
     *                                   
     */

    const handleAddFiles = (files) => {
        
        const types = ["doc", "docx", "txt", "pdf", "ppt", "pptx", "xlsx", "xls"]
        const to_upload = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            //Check if there's duplicates
            const name = file.name

            //Check type
            let type = file.name.split('.')
            type = type[type.length-1].toLowerCase()
            if(!types.includes(type)) {
                return setError("Ce type de fichier n'est pas supporté.")
            }

            //Check size
            const size_in_bytes = file.size
            const size_in_mb = size_in_bytes/1000000
            if(size_in_mb > 30) {
                return setError("Ce fichier dépasse la taille maximale de 10MB.")
            }

            if(i >= 10) {
                setError("Vous ne pouvez que téléverser un maximum de 10 documents à la fois.")
                break;
            }
            to_upload.push(file)
            
        }
        
        if(to_upload.length > 0) {
            

            const uploadProgress = {}
            to_upload.forEach(file => {
                uploadProgress[file.name] = { progress: 0, name: file.name }
            })

            setNewContentFiles(to_upload)
            setNewContentFilesUploadData(uploadProgress)
        }
    }

    const handleRemoveFile = (file) => {

        let files = [...newContentFiles]
        files = files.filter(f => f.name !== file.name)
        setNewContentFiles(files)

    }

    const handleUploadFiles = () => {

        if(newContentFiles.length < 1) return setError("Aucun fichier selectionné.")

        setStep(2)
        const files = newContentFiles
        files.forEach(file => {

            uploadFile(groupInfos.course.id, groupInfos.group.id, userInfos.id, file,
                (data) => {
                    let uploadData = {...newContentFilesUploadData}
                    uploadData[file.name].progress = data.value
                    setNewContentFilesUploadData(uploadData)
                }
            )

        })

    }

    const UploadingDocuments = () => {
        const files = Object.keys(newContentFilesUploadData)
        return(
            <div className="document-uploader_uploading">
                {
                    files.map(file =>
                        <div className="document-uploader_uploading-single" key={newContentFilesUploadData[file].name}>
                            {
                                newContentFilesUploadData[file].progress < 100 ?
                                <>
                                    <div className="infos">
                                        <span>{newContentFilesUploadData[file].name}</span>
                                        <i>{(newContentFilesUploadData[file].progress).toFixed(0)}%</i>
                                    </div>
                                    <div className="bar">
                                        <div className="progress" style={{ width: `${(newContentFilesUploadData[file].progress).toFixed(0)}%` }}></div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="infos">
                                        <span>{newContentFilesUploadData[file].name}</span>
                                        <HiOutlineCheck />
                                    </div>
                                </>
                            }
                        </div>    
                    )
                } 
            </div>
        )
    }

    /***
     *                                  
     *     #      #  ####  #####  ####  
     *     #      # #        #   #      
     *     #      #  ####    #    ####  
     *     #      #      #   #        # 
     *     #      # #    #   #   #    # 
     *     ###### #  ####    #    ####  
     *                                  
     */
    const PastDocuments = () => {

        if(groupFiles === null) return <LoaderSmall />
        
        const past_files = groupFiles.out
        console.log(past_files);

        return null

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

            const documents = groupInfos.group.data.files.map(file => file.id)
            getGroupFiles(groupInfos.course.id, documents)
            .then(files => {
                setGroupFiles(files)
            })

            getCategories()
            .then(values => setCategories(values))

        }

    }, [groupInfos])

    return (
        <Layout
            pageTitle="Ajouter du matériel de classe"
            navigationVisible={true}
            requiresCourse={true}
            onGetUserInfos={data => setUserInfos(data)}
            onGetGroupInfos={data => setGroupInfos(data)}
            id="content-creator"
        >

            <section className="content-creator_container">
                <h1>Ajouter du matériel de classe</h1>
                <div className="content-creator">

                    {
                        step === 0 ?
                        <>
                            <div className="content-creator_method">
                                <button onClick={() => { setNewContentMethod("files"); setStep(1) }}>
                                    <HiOutlineDocumentDuplicate />
                                    <span>Fichiers</span>
                                </button>
                                <button onClick={() => { setNewContentMethod("url"); setStep(1) }}>
                                    <HiOutlineLink />
                                    <span>Site web (URL)</span>
                                </button>
                                <button onClick={() => { setNewContentMethod("past"); setStep(1) }}>
                                    <HiOutlineSave />
                                    <span>Matériel d'un autre groupe</span>
                                </button>
                                <button onClick={() => { setNewContentMethod("post"); setStep(1) }}>
                                    <HiOutlinePencil />
                                    <span>Publication</span>
                                </button>
                            </div>
                        </>
                        :
                        step === 1 ?
                        <>
                            
                            {
                                newContentMethod === "files" ?
                                <>
                                    <input type="file"  id="document-uploader" name="documents[]" className="uploader-container_input" multiple="multiple" onChange={e => handleAddFiles(e.target.files)} />
                                    <Uploader inputId="document-uploader" onDrop={files => handleAddFiles(files)} />
                                    <div className="document-uploader_list">
                                        {
                                            newContentFiles.map(file => <button onClick={() => handleRemoveFile(file)} key={file.name}>{file.name}</button>)
                                        }
                                    </div>
                                    <div className="content-creator_buttons">
                                        <button className="cta gray" onClick={() => setStep(0)}>Annuler</button>
                                        <button className="cta blue" onClick={() => handleUploadFiles()}>Suivant</button>
                                    </div>
                                </>
                                :
                                null
                            }


                        </>
                        :
                        step === 2 ?
                        <>
                            {/* résumé de l'ajout */}
                            <div className="content-creator_summary">

                                {
                                    newContentMethod === "files" ?
                                    <UploadingDocuments />
                                    :
                                    null
                                }

                            </div>

                            

                            <Drawer toggleTitle="Options supplémentaires" untoggleTitle="Cacher">
                                <h4 style={{marginBottom: "0.5rem"}}>Rendre disponnible à une date</h4>
                                <Input type="date" value={newContentAvailableDate} placeholder={`Date: ${newContentAvailableDate}`} /> 
                                <h4 style={{margin: "0.5rem 0"}}>Rendre disponnible à une heure</h4>
                                <Input type="time" value={newContentAvailableTime} placeholder={`Heure: ${newContentAvailableTime}`} /> 
                            </Drawer>                            
                        </>
                        : null
                    }
                </div>
            </section>
            <ErrorAlert onClick={() => setError("")} visible={validateEmpty(error)} content={error}/>



        </Layout>
    )
}
