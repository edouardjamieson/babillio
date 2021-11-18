import { useState, useEffect } from "react";
import CurrentGroupBanner from "/components/CurrentGroupBanner";

import Layout from "/components/Layout";
import Loader from "/components/Loader";

export default function Home() {

  const [loading, setLoading] = useState(true)
  const [groupInfos, setGroupInfos] = useState(null)

  useEffect(() => {
    setLoading(false)
  }, [])

  if(loading) return <Loader/>

  return (
    <Layout pageTitle="Accueil" navigationVisible={true} requiresCourse={true} onGetGroupInfos={(data) => setGroupInfos(data)}>

      <div className="course-overview">

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
