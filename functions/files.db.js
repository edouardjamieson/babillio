import { db } from "./firebase";

/***
 *     ######   ######## ########     ######   ########   #######  ##     ## ########     ######## #### ##       ########  ######  
 *    ##    ##  ##          ##       ##    ##  ##     ## ##     ## ##     ## ##     ##    ##        ##  ##       ##       ##    ## 
 *    ##        ##          ##       ##        ##     ## ##     ## ##     ## ##     ##    ##        ##  ##       ##       ##       
 *    ##   #### ######      ##       ##   #### ########  ##     ## ##     ## ########     ######    ##  ##       ######    ######  
 *    ##    ##  ##          ##       ##    ##  ##   ##   ##     ## ##     ## ##           ##        ##  ##       ##             ## 
 *    ##    ##  ##          ##       ##    ##  ##    ##  ##     ## ##     ## ##           ##        ##  ##       ##       ##    ## 
 *     ######   ########    ##        ######   ##     ##  #######   #######  ##           ##       #### ######## ########  ######  
 */
async function getGroupFiles(course_id, group_documents) {

    //get tous les documents avec le course id
    const files_query = await db.collection('files').where('course_id', '==', course_id).get()
    
    //filtrer les documents qu'on a dans le groupe et ceux pas dans le groupe
    const data = {
        in: files_query.docs.filter(file => group_documents.includes(file.id)),
        out: files_query.docs.filter(file => !group_documents.includes(file.id))
    }
    return data


}

export { getGroupFiles }