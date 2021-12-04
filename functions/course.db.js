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

    const data = []
    const all_courses = await db.collection('courses').where('__name__', 'in', courses).get()
    const all_groups = await db.collection('groups').get()

    //get groups for each courses
    all_courses.forEach(course => {
        data.push({
            course: { id:course.id, data:course.data() },
            groups: all_groups.docs.filter(group => course.data().groups.includes(group.id)).map(group => ({ id: group.id, data: group.data() }))
        })
    })
    return data
}

/***
 *     ######   ######## ########     ######   ########   #######  ##     ## ########   ######     #### ##    ## ########  #######   ######  
 *    ##    ##  ##          ##       ##    ##  ##     ## ##     ## ##     ## ##     ## ##    ##     ##  ###   ## ##       ##     ## ##    ## 
 *    ##        ##          ##       ##        ##     ## ##     ## ##     ## ##     ## ##           ##  ####  ## ##       ##     ## ##       
 *    ##   #### ######      ##       ##   #### ########  ##     ## ##     ## ########   ######      ##  ## ## ## ######   ##     ##  ######  
 *    ##    ##  ##          ##       ##    ##  ##   ##   ##     ## ##     ## ##              ##     ##  ##  #### ##       ##     ##       ## 
 *    ##    ##  ##          ##       ##    ##  ##    ##  ##     ## ##     ## ##        ##    ##     ##  ##   ### ##       ##     ## ##    ## 
 *     ######   ########    ##        ######   ##     ##  #######   #######  ##         ######     #### ##    ## ##        #######   ######  
 */
async function getGroupsInfos(courses, user_id) {
    console.log(user_id);

    const data = []
    const my_courses = await db.collection('courses').where('__name__', 'in', courses).get()
    const my_groups = await db.collection('groups').where('course_id', 'in', courses).where('students', 'array-contains', user_id).get()
   
    my_courses.docs.forEach(course => {

        const group = my_groups.docs.filter(group => group.data().course_id === course.id)[0]

        data.push({
            course: { id: course.id, data: course.data() },
            group: { id: group.id, data: group.data() }
        })

    })
    return data


    // return {
    //     courses: my_courses.docs.map(course => ({ id: course.id, data: course.data() })),
    //     groups: my_groups.docs.map(group => ({ id: group.id, data: group.data() })),
    // }
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

    return {id: file_query.id, data: new_file}

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

/***
 *     ######   ######## ########     ######   ########   #######  ##     ## ########     ########  ##    ##     ######   #######  ########  ######## 
 *    ##    ##  ##          ##       ##    ##  ##     ## ##     ## ##     ## ##     ##    ##     ##  ##  ##     ##    ## ##     ## ##     ## ##       
 *    ##        ##          ##       ##        ##     ## ##     ## ##     ## ##     ##    ##     ##   ####      ##       ##     ## ##     ## ##       
 *    ##   #### ######      ##       ##   #### ########  ##     ## ##     ## ########     ########     ##       ##       ##     ## ##     ## ######   
 *    ##    ##  ##          ##       ##    ##  ##   ##   ##     ## ##     ## ##           ##     ##    ##       ##       ##     ## ##     ## ##       
 *    ##    ##  ##          ##       ##    ##  ##    ##  ##     ## ##     ## ##           ##     ##    ##       ##    ## ##     ## ##     ## ##       
 *     ######   ########    ##        ######   ##     ##  #######   #######  ##           ########     ##        ######   #######  ########  ######## 
 */
async function getGroupByCode(code) {

    // group query
    const group_query = await db.collection('groups').where('join_code', '==', code).get()
    
    if(group_query.empty === true) return 0
    return group_query.docs[0]

}



export { 
    getCurrentCourse,
    addCourse,
    getCourseInfos,
    addCourseFiles,
    courseFileAddGroup,
    courseFileRemoveGroup,
    deleteFile,
    getGroupByCode,
    getGroupsInfos
}