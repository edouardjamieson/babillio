import { useRouter } from "next/dist/client/router";

export default function CurrentGroupBanner({ groupInfos }) {

    const router = useRouter()

    return groupInfos ? 
    <div className="current-group_banner">
        <i className="current-group_icon">{groupInfos.course.data.icon}</i>
        <h2 className="current-group_name">{ groupInfos.course.data.name }</h2>
        <span className="current-group_name">gr. { groupInfos.group.name }</span>
        <button className="cta gray" onClick={() => router.push(`/app/select?gobackto=${router.asPath}`)}>Changer</button>
    </div> : null

}
