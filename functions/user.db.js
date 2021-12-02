import { auth, db, fields } from './firebase'
/***
 *     ######   ######## ########    ##        #######   ######    ######   ######## ########     ##     ##  ######  ######## ########  
 *    ##    ##  ##          ##       ##       ##     ## ##    ##  ##    ##  ##       ##     ##    ##     ## ##    ## ##       ##     ## 
 *    ##        ##          ##       ##       ##     ## ##        ##        ##       ##     ##    ##     ## ##       ##       ##     ## 
 *    ##   #### ######      ##       ##       ##     ## ##   #### ##   #### ######   ##     ##    ##     ##  ######  ######   ########  
 *    ##    ##  ##          ##       ##       ##     ## ##    ##  ##    ##  ##       ##     ##    ##     ##       ## ##       ##   ##   
 *    ##    ##  ##          ##       ##       ##     ## ##    ##  ##    ##  ##       ##     ##    ##     ## ##    ## ##       ##    ##  
 *     ######   ########    ##       ########  #######   ######    ######   ######## ########      #######   ######  ######## ##     ## 
 */
function getAuth(cb) {
    auth.onAuthStateChanged(u => {
        cb(u)
    })
}

function getLoggedUser() {
    return auth.currentUser
}

async function getUserByID(id) {
    const user = await db.collection('users').doc(id).get()
    return user
}

/***
 *       ###    ########  ########     ##     ##  ######  ######## ########  
 *      ## ##   ##     ## ##     ##    ##     ## ##    ## ##       ##     ## 
 *     ##   ##  ##     ## ##     ##    ##     ## ##       ##       ##     ## 
 *    ##     ## ##     ## ##     ##    ##     ##  ######  ######   ########  
 *    ######### ##     ## ##     ##    ##     ##       ## ##       ##   ##   
 *    ##     ## ##     ## ##     ##    ##     ## ##    ## ##       ##    ##  
 *    ##     ## ########  ########      #######   ######  ######## ##     ## 
 */
async function insertUserInDB(data) {

    const name = data.name
    const email = data.email
    const profile_picture = data.profile_picture
    const userid = data.userid
    const email_verified = data.email_verified
    const created_at = Date.now()

    const body = {
        name: name,
        email: email,
        profile_picture: profile_picture,
        created_at: created_at,
        type: null,
        email_verified: email_verified,
        account_setup: false
    }
    const query = await db.collection('users').doc(userid).set(body)
    return body
}

/***
 *    ######## ########  #### ########    ##     ##  ######  ######## ########     #### ##    ## ########  #######   ######  
 *    ##       ##     ##  ##     ##       ##     ## ##    ## ##       ##     ##     ##  ###   ## ##       ##     ## ##    ## 
 *    ##       ##     ##  ##     ##       ##     ## ##       ##       ##     ##     ##  ####  ## ##       ##     ## ##       
 *    ######   ##     ##  ##     ##       ##     ##  ######  ######   ########      ##  ## ## ## ######   ##     ##  ######  
 *    ##       ##     ##  ##     ##       ##     ##       ## ##       ##   ##       ##  ##  #### ##       ##     ##       ## 
 *    ##       ##     ##  ##     ##       ##     ## ##    ## ##       ##    ##      ##  ##   ### ##       ##     ## ##    ## 
 *    ######## ########  ####    ##        #######   ######  ######## ##     ##    #### ##    ## ##        #######   ######  
 */
async function editUserByID(id, data) {
    const query = await db.collection('users').doc(id).update(data, { merge: true })
    return query
}

/***
 *     ######   ######## ########    ##     ##  ######  ######## ########   ######  
 *    ##    ##  ##          ##       ##     ## ##    ## ##       ##     ## ##    ## 
 *    ##        ##          ##       ##     ## ##       ##       ##     ## ##       
 *    ##   #### ######      ##       ##     ##  ######  ######   ########   ######  
 *    ##    ##  ##          ##       ##     ##       ## ##       ##   ##         ## 
 *    ##    ##  ##          ##       ##     ## ##    ## ##       ##    ##  ##    ## 
 *     ######   ########    ##        #######   ######  ######## ##     ##  ######  
 */
async function getUsers(ids) {

    const user_query = await db.collection('users').where('__name__', 'in', ids).get()
    return user_query.docs.map(user => ({ id:user.id, data: user.data() }))
}

/***
 *          ##  #######  #### ##    ##     ######   ########   #######  ##     ## ########  
 *          ## ##     ##  ##  ###   ##    ##    ##  ##     ## ##     ## ##     ## ##     ## 
 *          ## ##     ##  ##  ####  ##    ##        ##     ## ##     ## ##     ## ##     ## 
 *          ## ##     ##  ##  ## ## ##    ##   #### ########  ##     ## ##     ## ########  
 *    ##    ## ##     ##  ##  ##  ####    ##    ##  ##   ##   ##     ## ##     ## ##        
 *    ##    ## ##     ##  ##  ##   ###    ##    ##  ##    ##  ##     ## ##     ## ##        
 *     ######   #######  #### ##    ##     ######   ##     ##  #######   #######  ##        
 */
async function addUserToGroup(course_id, group_id, user_id) {

    //user query
    const user_query = await db.collection('users').doc(user_id).update({
        courses: fields.arrayUnion({
            id: course_id,
            role: 'default'
        })
    })

    //group query
    const group_check_query = await db.collection('groups').doc(group_id).get()
    if(group_check_query.data().students.includes(user_id)) {
        return 0
    }

    const group_query = await db.collection('groups').doc(group_id).update({
        students: fields.arrayUnion(user_id)
    })

    return 1


}

export { getAuth, getLoggedUser, insertUserInDB, getUserByID, editUserByID, getUsers, addUserToGroup }