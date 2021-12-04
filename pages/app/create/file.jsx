import { useState } from "react"
import Input from "../../../components/Input"
import Layout from "../../../components/Layout"

export default function file() {

    const [userInfos, setUserInfos] = useState(null)
    const [groupInfos, setGroupInfos] = useState(null)

    const [step, setStep] = useState(0)

    const [documentUploadFiles, setDocumentUploadFiles] = useState([])
    const [documentUploadURL, setDocumentUploadURL] = useState("")
    const [documentUploadErrors, setDocumentUploadErrors] = useState("")
    const [documentActionsID, setDocumentActionsID] = useState("")
    const [documentUploadMethod, setDocumentUploadMethod] = useState("")

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
                <h1>Ajouter des document</h1>
                <div className="content-creator">

                    {
                        step === 0 ?
                        <>

                            <div className="uploader-container">
                                <input type="file"  id="document-uploader" name="documents[]" className="uploader-container_input" multiple="multiple" />
                                <label htmlFor="document-uploader" className="uploader-container_label">
                                    Glissez & déposez des fichiers ici ou cliquez ici pour en sélectionner.
                                </label>
                            </div>
                            <Input type="text" placeholder="Ou saisissez une url" value={documentUploadURL} onChange={data => setDocumentUploadURL(data)} />
                            <div className="content-creator_buttons">
                                <button className="cta blue">Suivant</button>
                            </div>

                        </>
                        : null
                    }
                </div>
            </section>



        </Layout>
    )
}
