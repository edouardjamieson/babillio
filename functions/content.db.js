import { db, fields, storage } from "./firebase";
import { generateUniqueID } from './utils'

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

async function uploadFile(course_id, group_id, user_id, file, onChange) {

    let type = file.name.split('.')
    type = type[type.length-1].toLowerCase()

    const uuid = generateUniqueID()
    const file_name = `bf_${uuid}_${Date.now()}_${user_id}.${type}`
    const path = `/content/documents/${file_name}`

    const storage_query = storage.ref(path).put(file)
    storage_query.on('state_changed', snap => {
        let progress = (snap.bytesTransferred / snap.totalBytes) * 100
        onChange ? onChange({ type: 'progress', value: progress }) : null
    },
    err => {
        onChange ? onChange({ type: 'error', value: err }) : null
    },
    () => {
        storage_query.snapshot.ref.getDownloadURL()
        .then(url => {
            const new_file = {
                course_id: course_id,
                created_at: Date.now(),
                name: file_name,
                original_name: file.name,
                path: path,
                url: url,
                uploaded_by: user_id
            }
    
            //file query
            const file_query = db.collection('content').add(new_file)
            .then(doc => {
                //group query
                const group_query = db.collection('groups').doc(group_id).update({
                    content: fields.arrayUnion({
                        id: doc.id,
                        available_at: Date.now()
                    })
                })
            })
    
        })


    }
    )
    


}

/***
 *     ######   ######## ########     ######     ###    ######## ########  ######    #######  ########  #### ########  ######  
 *    ##    ##  ##          ##       ##    ##   ## ##      ##    ##       ##    ##  ##     ## ##     ##  ##  ##       ##    ## 
 *    ##        ##          ##       ##        ##   ##     ##    ##       ##        ##     ## ##     ##  ##  ##       ##       
 *    ##   #### ######      ##       ##       ##     ##    ##    ######   ##   #### ##     ## ########   ##  ######    ######  
 *    ##    ##  ##          ##       ##       #########    ##    ##       ##    ##  ##     ## ##   ##    ##  ##             ## 
 *    ##    ##  ##          ##       ##    ## ##     ##    ##    ##       ##    ##  ##     ## ##    ##   ##  ##       ##    ## 
 *     ######   ########    ##        ######  ##     ##    ##    ########  ######    #######  ##     ## #### ########  ######  
 */
async function getCategories() {
    //Retourne seulement les noms et id des catégories
    const course_id = window.localStorage.getItem('babillio_current_course_id')
    const categories_query = await db.collection('categories').where('course_id', '==', course_id).get()
    const categories = categories_query.docs.map(category => ({ id: category.id, name: category.data().name }))
    return categories
}

export { getGroupFiles, uploadFile, getCategories }