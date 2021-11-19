import { auth, db } from './firebase'
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
async function getUsers(id) {

    if(typeof id === 'object') {
        const user_query = await db.collection('users').get()
        const users = user_query.docs.filter(user => id.includes(user.id))
        return users
    }else{
        const user_query = await db.collection('users').doc(id).get()
        return {id: user_query.id, data:user_query.data()}
    }

}

export { getAuth, getLoggedUser, insertUserInDB, getUserByID, editUserByID, getUsers }