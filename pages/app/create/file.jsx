import { useEffect, useState } from "react"
import Input from "../../../components/Input"
import Layout from "../../../components/Layout"
import Uploader from "../../../components/Uploader"
import ErrorAlert from '/components/ErrorAlert'
import LoaderSmall from '../../../components/LoaderSmall'
import { validateEmpty } from "../../../functions/utils"
import { HiOutlineCheck, HiOutlineDocumentDuplicate, HiOutlineLink } from "react-icons/hi"
import { getGroupFiles, uploadFile } from '../../../functions/files.db'

export default function file() {

    const [userInfos, setUserInfos] = useState(null)
    const [groupInfos, setGroupInfos] = useState(null)

    const [step, setStep] = useState(1)
    const [error, setError] = useState("")

    const [documentUploadFiles, setDocumentUploadFiles] = useState([])
    const [documentUploadURL, setDocumentUploadURL] = useState("")
    const [documentUploadMethod, setDocumentUploadMethod] = useState("upload")

    const [groupFiles, setGroupFiles] = useState(null)
    const [groupFilesUploadData, setGroupFilesUploadData] = useState({})

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

            setDocumentUploadFiles(to_upload)
            setGroupFilesUploadData(uploadProgress)
        }
    }

    const handleRemoveFile = (file) => {

        let files = [...documentUploadFiles]
        files = files.filter(f => f.name !== file.name)
        setDocumentUploadFiles(files)

    }

    const handleManageUpload = () => {

        const upload_data = Object.keys(groupFilesUploadData)
        const files = documentUploadFiles
        files.forEach(file => {

            uploadFile(groupInfos.course.id, groupInfos.group.id, userInfos.id, file,
                (data) => {
                    let uploadData = {...groupFilesUploadData}
                    uploadData[file.name].progress = data.value
                    setGroupFilesUploadData(uploadData)
                }
            )

            // let uploadData = [...groupFilesUploadData]
            // let upload = uploadData.filter(f => f.name === file.name).length > 0 ? uploadData.filter(f => f.name === file.name)[0] : { name: file.name, progress: 0 }
            // upload.progress = data.value


            

            // console.log(upload);
            // setgroupFilesUploadData(uploadData)

        })

    }

    const handleUploadFiles = () => {

        //If we uploaded files
        if(documentUploadMethod === "upload") {
            //If there is no file to upload we throw an error
            if(documentUploadFiles.length < 1) return setError("Aucun fichier selectionné.")

            handleManageUpload()
            setStep(2)



        }

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

    const UploadingDocuments = () => {

        const files = Object.keys(groupFilesUploadData)
        return(
            <div className="document-uploader_uploading">
                {
                    files.map(file =>
                        <div className="document-uploader_uploading-single" key={groupFilesUploadData[file].name}>
                            {
                                groupFilesUploadData[file].progress < 100 ?
                                <>
                                    <div className="infos">
                                        <span>{groupFilesUploadData[file].name}</span>
                                        <i>{(groupFilesUploadData[file].progress).toFixed(0)}%</i>
                                    </div>
                                    <div className="bar">
                                        <div className="progress" style={{ width: `${(groupFilesUploadData[file].progress).toFixed(0)}%` }}></div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="infos">
                                        <span>{groupFilesUploadData[file].name}</span>
                                        <HiOutlineCheck />
                                    </div>
                                </>
                            }
                        </div>    
                    )
                } 
            </div>
        )

        // 

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

        }

    }, [groupInfos])

    return (
        <Layout
            pageTitle="Ajouter des documents"
            navigationVisible={true}
            requiresCourse={true}
            onGetUserInfos={data => setUserInfos(data)}
            onGetGroupInfos={data => setGroupInfos(data)}
            id="file-creator"
        >

            <section className="content-creator_container">
                <h1>Ajouter des documents</h1>
                <div className="content-creator">

                    {
                        step === 0 ?
                        <>
                            <div className="document-uploader_method">
                                <button onClick={() => { setDocumentUploadMethod("upload"); setStep(1) }}>
                                    <HiOutlineDocumentDuplicate />
                                    <span>En selectionnant des fichiers</span>
                                </button>
                                <button onClick={() => { setDocumentUploadMethod("url"); setStep(1) }}>
                                    <HiOutlineLink />
                                    <span>Depuis une URL</span>
                                </button>
                            </div>
                            <p className="content-creator_desc">Ou ajoutez en depuis ceux de d'autres groupes de ce cours</p>
                            <PastDocuments />
                        </>
                        :
                        step === 1 ?
                        <>
                            
                            {
                                documentUploadMethod === "upload" ?
                                <>
                                    <input type="file"  id="document-uploader" name="documents[]" className="uploader-container_input" multiple="multiple" onChange={e => handleAddFiles(e.target.files)} />
                                    <Uploader inputId="document-uploader" onDrop={files => handleAddFiles(files)} />
                                    <div className="document-uploader_list">
                                        {
                                            documentUploadFiles.map(file => <button onClick={() => handleRemoveFile(file)} key={file.name}>{file.name}</button>)
                                        }
                                    </div>
                                </>
                                :
                                <>
                                    <Input type="text" placeholder="Saisissez une url" value={documentUploadURL} onChange={data => setDocumentUploadURL(data)} />
                                </>
                            }
                            <div className="content-creator_buttons">
                                <button className="cta gray" onClick={() => setStep(0)}>Précédent</button>
                                <button className="cta blue" onClick={() => handleUploadFiles()}>Suivant</button>
                            </div>


                        </>
                        :
                        step === 2 ?
                        <>
                            <div className="document-uploader_summary">
                                <UploadingDocuments />

                                
                            </div>
                        </>
                        : null
                    }
                </div>
            </section>
            <ErrorAlert onClick={() => setError("")} visible={validateEmpty(error)} content={error}/>



        </Layout>
    )
}
