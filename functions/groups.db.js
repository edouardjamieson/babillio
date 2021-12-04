import { db, fields } from './firebase'

/***
 *     ######  ########  ########    ###    ######## ########     ######   ########   #######  ##     ## ########  
 *    ##    ## ##     ## ##         ## ##      ##    ##          ##    ##  ##     ## ##     ## ##     ## ##     ## 
 *    ##       ##     ## ##        ##   ##     ##    ##          ##        ##     ## ##     ## ##     ## ##     ## 
 *    ##       ########  ######   ##     ##    ##    ######      ##   #### ########  ##     ## ##     ## ########  
 *    ##       ##   ##   ##       #########    ##    ##          ##    ##  ##   ##   ##     ## ##     ## ##        
 *    ##    ## ##    ##  ##       ##     ##    ##    ##          ##    ##  ##    ##  ##     ## ##     ## ##        
 *     ######  ##     ## ######## ##     ##    ##    ########     ######   ##     ##  #######   #######  ##        
 */
async function createGroup(data) {

    const course_id = data.course_id

    //group query
    const group_query = await db.collection('groups').add(data)

    //class query
    const course_query = await db.collection('courses').doc(course_id).update({
        groups: fields.arrayUnion(group_query.id)
    })

    return group_query.id

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

export { createGroup, setCurrentGroup }