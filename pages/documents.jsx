import { useState } from "react";
import Layout from "../components/Layout";
import CurrentGroupBanner from "../components/CurrentGroupBanner";

export default function documents() {

    const [groupInfos, setGroupInfos] = useState(null)


    return (
        <Layout pageTitle="Documents" currentPage="documents" navigationVisible={true} requiresCourse={true} onGetGroupInfos={(data) => setGroupInfos(data)}>

            <div className="documents-overview">
                {
                    groupInfos ? <CurrentGroupBanner groupInfos={groupInfos} /> : null
                }
                
                <div className="section-header">
                    <h1>Vue d'ensemble</h1>
                </div>
            </div>


        </Layout>
    )
}
