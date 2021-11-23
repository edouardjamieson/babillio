import { db, fields, storage } from './firebase'
import { getLoggedUser } from './user.db'
import { generateUniqueID, validateEmpty } from './utils'
/***
 *     ######   ######## ########     ######  ##     ## ########  ########  ######## ##    ## ########     ######   #######  ##     ## ########   ######  ######## 
 *    ##    ##  ##          ##       ##    ## ##     ## ##     ## ##     ## ##       ###   ##    ##       ##    ## ##     ## ##     ## ##     ## ##    ## ##       
 *    ##        ##          ##       ##       ##     ## ##     ## ##     ## ##       ####  ##    ##       ##       ##     ## ##     ## ##     ## ##       ##       
 *    ##   #### ######      ##       ##       ##     ## ########  ########  ######   ## ## ##    ##       ##       ##     ## ##     ## ########   ######  ######   
 *    ##    ##  ##          ##       ##       ##     ## ##   ##   ##   ##   ##       ##  ####    ##       ##       ##     ## ##     ## ##   ##         ## ##       
 *    ##    ##  ##          ##       ##    ## ##     ## ##    ##  ##    ##  ##       ##   ###    ##       ##    ## ##     ## ##     ## ##    ##  ##    ## ##       
 *     ######   ########    ##        ######   #######  ##     ## ##     ## ######## ##    ##    ##        ######   #######   #######  ##     ##  ######  ######## 
 */
async function getCurrentCourse(user_id) {
    // ====================================================================
    // Get course from local storage & returns null if not existant
    // ====================================================================
    const course_id = window.localStorage.getItem('babillio_current_course_id')
    const group_id = window.localStorage.getItem('babillio_current_group_id')
    if(!course_id) return null
    if(!group_id) return null

    //get course & group infos
    const course_query = await db.collection('courses').doc(course_id).get()
    const group_query = await db.collection('groups').doc(group_id).get()
    if(group_query.exists !== true) return null
    if(group_query.exists !== true) return null

    return {
        course: {id: course_query.id, data:course_query.data()},
        group: {id: group_query.id, data:group_query.data()}
    }
}

/***
 *     ######  ######## ##       ########  ######  ########     ######   ########   #######  ##     ## ########  
 *    ##    ## ##       ##       ##       ##    ##    ##       ##    ##  ##     ## ##     ## ##     ## ##     ## 
 *    ##       ##       ##       ##       ##          ##       ##        ##     ## ##     ## ##     ## ##     ## 
 *     ######  ######   ##       ######   ##          ##       ##   #### ########  ##     ## ##     ## ########  
 *          ## ##       ##       ##       ##          ##       ##    ##  ##   ##   ##     ## ##     ## ##        
 *    ##    ## ##       ##       ##       ##    ##    ##       ##    ##  ##    ##  ##     ## ##     ## ##        
 *     ######  ######## ######## ########  ######     ##        ######   ##     ##  #######   #######  ##        
 */
async function setCurrentGroup(course_id, group_id, user_data) {

    //check if course_id is legit
    const course_query = await db.collection('courses').doc(course_id).get()
    if(course_query.exists !== true) return false
    
    //check if group_id is legit and course has this group
    const group_query = await db.collection('groups').doc(group_id).get()
    if(group_query.exists !== true) return false
    if(!course_query.data().groups.includes(group_id)) return false


    //Set storage
    window.localStorage.setItem('babillio_current_course_id', course_id)
    window.localStorage.setItem('babillio_current_group_id', group_id)
    return true

}

/***
 *       ###    ########  ########      ######   #######  ##     ## ########   ######  ######## 
 *      ## ##   ##     ## ##     ##    ##    ## ##     ## ##     ## ##     ## ##    ## ##       
 *     ##   ##  ##     ## ##     ##    ##       ##     ## ##     ## ##     ## ##       ##       
 *    ##     ## ##     ## ##     ##    ##       ##     ## ##     ## ########   ######  ######   
 *    ######### ##     ## ##     ##    ##       ##     ## ##     ## ##   ##         ## ##       
 *    ##     ## ##     ## ##     ##    ##    ## ##     ## ##     ## ##    ##  ##    ## ##       
 *    ##     ## ########  ########      ######   #######   #######  ##     ##  ######  ######## 
 */
async function addCourse(data) {
    // ====================================================================
    // Inserts course into db & add course to user's table
    // ====================================================================
    const course_query = await db.collection('courses').add(data)
    const course_id = course_query.id

    const user_query = await db.collection('users').doc(getLoggedUser().uid).update({
        courses : fields.arrayUnion({
            id: course_id,
            role: 'admin'
        })
    })
}

/***
 *     ######   ######## ########     ######   #######  ##     ## ########   ######  ########    #### ##    ## ########  #######   ######  
 *    ##    ##  ##          ##       ##    ## ##     ## ##     ## ##     ## ##    ## ##           ##  ###   ## ##       ##     ## ##    ## 
 *    ##        ##          ##       ##       ##     ## ##     ## ##     ## ##       ##           ##  ####  ## ##       ##     ## ##       
 *    ##   #### ######      ##       ##       ##     ## ##     ## ########   ######  ######       ##  ## ## ## ######   ##     ##  ######  
 *    ##    ##  ##          ##       ##       ##     ## ##     ## ##   ##         ## ##           ##  ##  #### ##       ##     ##       ## 
 *    ##    ##  ##          ##       ##    ## ##     ## ##     ## ##    ##  ##    ## ##           ##  ##   ### ##       ##     ## ##    ## 
 *     ######   ########    ##        ######   #######   #######  ##     ##  ######  ########    #### ##    ## ##        #######   ######  
 */
async function getCourseInfos(courses) {

    if(typeof courses === 'object') {
        const data = []
        const all_courses = await db.collection('courses').where('__name__', 'in', courses).get()
        const all_groups = await db.collection('groups').get()

        //get asked courses
        const my_courses = all_courses.docs.filter(course => courses.includes(course.id)).map(course => ({ id: course.id, data:course.data() }))
        //get groups for each courses
        all_courses.forEach(course => {
            data.push({
                course: { id:course.id, data:course.data() },
                groups: all_groups.docs.filter(group => course.data().groups.includes(group.id)).map(group => ({ id: group.id, data: group.data() }))
            })
        })
        return data

    }else if(typeof courses === 'string') {
        // const course_query = await db.collection('courses').doc(courses).get()
        // const group_query = await db.collection('courses').doc(courses).collection('groups').get()
        // return {
        //     course: { id: course_query.id, data: course_query.data() },
        //     groups: group_query.docs.map(group => ({ id: group.id, data: group.data() }))
        // }
    }

}

/***
 *       ###    ########  ########      ######   ########   #######  ##     ## ########  
 *      ## ##   ##     ## ##     ##    ##    ##  ##     ## ##     ## ##     ## ##     ## 
 *     ##   ##  ##     ## ##     ##    ##        ##     ## ##     ## ##     ## ##     ## 
 *    ##     ## ##     ## ##     ##    ##   #### ########  ##     ## ##     ## ########  
 *    ######### ##     ## ##     ##    ##    ##  ##   ##   ##     ## ##     ## ##        
 *    ##     ## ##     ## ##     ##    ##    ##  ##    ##  ##     ## ##     ## ##        
 *    ##     ## ########  ########      ######   ##     ##  #######   #######  ##        
 */
async function addGroupToCourse(course_id, group_data) {

    const group_query = await db.collection('groups').add(group_data)
    const course_query = await db.collection('courses').doc(course_id).update({
        groups: fields.arrayUnion(group_query.id)
    })
    return group_query.id

}

/***
 *       ###    ########  ########      ######   #######  ##     ## ########   ######  ########    ######## #### ##       ########  ######  
 *      ## ##   ##     ## ##     ##    ##    ## ##     ## ##     ## ##     ## ##    ## ##          ##        ##  ##       ##       ##    ## 
 *     ##   ##  ##     ## ##     ##    ##       ##     ## ##     ## ##     ## ##       ##          ##        ##  ##       ##       ##       
 *    ##     ## ##     ## ##     ##    ##       ##     ## ##     ## ########   ######  ######      ######    ##  ##       ######    ######  
 *    ######### ##     ## ##     ##    ##       ##     ## ##     ## ##   ##         ## ##          ##        ##  ##       ##             ## 
 *    ##     ## ##     ## ##     ##    ##    ## ##     ## ##     ## ##    ##  ##    ## ##          ##        ##  ##       ##       ##    ## 
 *    ##     ## ########  ########      ######   #######   #######  ##     ##  ######  ########    ##       #### ######## ########  ######  
 */
async function addCourseFiles(course_id, user_id, file, group_id) {

    let type = file.name.split('.')
    type = type[type.length-1].toLowerCase()

    const uuid = generateUniqueID()
    const path = `/content/documents/${uuid}.${type}`

    //upload query
    const storage_query = await storage.ref(path).put(file)
    const url = await storage_query.ref.getDownloadURL()

    const new_file = {
        url: url,
        created_at: Date.now(),
        groups:[group_id],
        uploaded_by: user_id,
        path: path,
        name: `${uuid}.${type}`,
        original_name: file.name,
        course_id: course_id
    }

    //document query
    const file_query = await db.collection('files').add(new_file)
    //course query
    const course_query = await db.collection('courses').doc(course_id).update({
        files: fields.arrayUnion(file_query.id)
    })

    return new_file

}

/***
 *     ######   ######## ########     ######   #######  ##     ## ########   ######  ########    ######## #### ##       ########  ######  
 *    ##    ##  ##          ##       ##    ## ##     ## ##     ## ##     ## ##    ## ##          ##        ##  ##       ##       ##    ## 
 *    ##        ##          ##       ##       ##     ## ##     ## ##     ## ##       ##          ##        ##  ##       ##       ##       
 *    ##   #### ######      ##       ##       ##     ## ##     ## ########   ######  ######      ######    ##  ##       ######    ######  
 *    ##    ##  ##          ##       ##       ##     ## ##     ## ##   ##         ## ##          ##        ##  ##       ##             ## 
 *    ##    ##  ##          ##       ##    ## ##     ## ##     ## ##    ##  ##    ## ##          ##        ##  ##       ##       ##    ## 
 *     ######   ########    ##        ######   #######   #######  ##     ##  ######  ########    ##       #### ######## ########  ######  
 */
async function getCourseFiles(course_id) {
    const course_query = await db.collection('courses').doc(course_id).get()
    if(course_query.data().files.length < 1) return []
    const file_query = await db.collection('files').where('__name__', 'in', course_query.data().files).get()
    return file_query.docs
}

/***
 *       ###    ########  ########      ######   ########   #######  ##     ## ########     ########  #######     ######## #### ##       ######## 
 *      ## ##   ##     ## ##     ##    ##    ##  ##     ## ##     ## ##     ## ##     ##       ##    ##     ##    ##        ##  ##       ##       
 *     ##   ##  ##     ## ##     ##    ##        ##     ## ##     ## ##     ## ##     ##       ##    ##     ##    ##        ##  ##       ##       
 *    ##     ## ##     ## ##     ##    ##   #### ########  ##     ## ##     ## ########        ##    ##     ##    ######    ##  ##       ######   
 *    ######### ##     ## ##     ##    ##    ##  ##   ##   ##     ## ##     ## ##              ##    ##     ##    ##        ##  ##       ##       
 *    ##     ## ##     ## ##     ##    ##    ##  ##    ##  ##     ## ##     ## ##              ##    ##     ##    ##        ##  ##       ##       
 *    ##     ## ########  ########      ######   ##     ##  #######   #######  ##              ##     #######     ##       #### ######## ######## 
 */
async function courseFileAddGroup(file_id, group_id) {

    const file_query = await db.collection('files').doc(file_id).update({
        groups: fields.arrayUnion(group_id)
    })

    // const file_query = await db.collection('courses')

    return 1

}

/***
 *    ########  ######## ##     ##  #######  ##     ## ########     ######   ########   #######  ##     ## ########     ######## ########   #######  ##     ##    ######## #### ##       ######## 
 *    ##     ## ##       ###   ### ##     ## ##     ## ##          ##    ##  ##     ## ##     ## ##     ## ##     ##    ##       ##     ## ##     ## ###   ###    ##        ##  ##       ##       
 *    ##     ## ##       #### #### ##     ## ##     ## ##          ##        ##     ## ##     ## ##     ## ##     ##    ##       ##     ## ##     ## #### ####    ##        ##  ##       ##       
 *    ########  ######   ## ### ## ##     ## ##     ## ######      ##   #### ########  ##     ## ##     ## ########     ######   ########  ##     ## ## ### ##    ######    ##  ##       ######   
 *    ##   ##   ##       ##     ## ##     ##  ##   ##  ##          ##    ##  ##   ##   ##     ## ##     ## ##           ##       ##   ##   ##     ## ##     ##    ##        ##  ##       ##       
 *    ##    ##  ##       ##     ## ##     ##   ## ##   ##          ##    ##  ##    ##  ##     ## ##     ## ##           ##       ##    ##  ##     ## ##     ##    ##        ##  ##       ##       
 *    ##     ## ######## ##     ##  #######     ###    ########     ######   ##     ##  #######   #######  ##           ##       ##     ##  #######  ##     ##    ##       #### ######## ######## 
 */
async function courseFileRemoveGroup(file_id, group_id) {

    const file_query = await db.collection('files').doc(file_id).update({
        groups: fields.arrayRemove(group_id)
    })

    return 1

}

/***
 *    ########  ######## ##       ######## ######## ########    ######## #### ##       ######## 
 *    ##     ## ##       ##       ##          ##    ##          ##        ##  ##       ##       
 *    ##     ## ##       ##       ##          ##    ##          ##        ##  ##       ##       
 *    ##     ## ######   ##       ######      ##    ######      ######    ##  ##       ######   
 *    ##     ## ##       ##       ##          ##    ##          ##        ##  ##       ##       
 *    ##     ## ##       ##       ##          ##    ##          ##        ##  ##       ##       
 *    ########  ######## ######## ########    ##    ########    ##       #### ######## ######## 
 */

async function deleteFile(course_id, file_id, file_url) {

    //Remove file from cloud
    const document_query = await storage.refFromURL(file_url).delete()

    //Remove file from db
    const course_query = await db.collection('courses').doc(course_id).update({
        file: fields.arrayRemove(file_id)
    })
    const file_query = await db.collection('files').doc(file_id).remove()

    return 1

}



export { 
    getCurrentCourse,
    setCurrentGroup,
    addCourse,
    getCourseInfos,
    addGroupToCourse,
    addCourseFiles,
    getCourseFiles,
    courseFileAddGroup,
    courseFileRemoveGroup,
    deleteFile,
}