import { db, fields } from './firebase'
import { getLoggedUser } from './user.db'
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
    const group_name = window.localStorage.getItem('babillio_current_group_name')
    if(!course_id) return null
    if(!group_name) return null

    //get course & group infos
    const course_query = await db.collection('courses').doc(course_id).get()
    const group = course_query.data().groups.filter(g => g.name === group_name)
    if(group.length < 1) return null

    return {
        course: {id: course_query.id, data:course_query.data()},
        group: group[0]
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
async function setCurrentGroup(course_id, group_data, user_data) {

    //check if course_id is legit
    const course_query = await db.collection('courses').doc(course_id).get()
    if(course_query.exists !== true) return false
    
    //check if course has group
    if(course_query.data().groups.filter(group => group.name === group_data.name) < 1) return false

    //Set storage
    window.localStorage.setItem('babillio_current_course_id', course_id)
    window.localStorage.setItem('babillio_current_group_name', group_data.name)
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
        const all_courses = await db.collection('courses').get()
        const my_courses = all_courses.docs.filter(course => courses.includes(course.id)).map(course => ({ id: course.id, data:course.data() }))
        return my_courses

    }else if(typeof courses === 'string') {
        const course_query = await db.collection('courses').doc(course_id).get()
        return course_query
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

    const group_query = await db.collection('courses').doc(course_id).update({
        groups: fields.arrayUnion(group_data)
    })

}

export { getCurrentCourse, setCurrentGroup, addCourse, getCourseInfos, addGroupToCourse }