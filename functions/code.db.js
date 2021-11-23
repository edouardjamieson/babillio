import { db, fields, storage } from './firebase'
import { getLoggedUser } from './user.db'
import { generateSmallID, generateUniqueID, validateEmpty } from './utils'

/***
 *     ######   ######## ##    ## ######## ########     ###    ######## ########          ##  #######  #### ##    ##     ######   #######  ########  ######## 
 *    ##    ##  ##       ###   ## ##       ##     ##   ## ##      ##    ##                ## ##     ##  ##  ###   ##    ##    ## ##     ## ##     ## ##       
 *    ##        ##       ####  ## ##       ##     ##  ##   ##     ##    ##                ## ##     ##  ##  ####  ##    ##       ##     ## ##     ## ##       
 *    ##   #### ######   ## ## ## ######   ########  ##     ##    ##    ######            ## ##     ##  ##  ## ## ##    ##       ##     ## ##     ## ######   
 *    ##    ##  ##       ##  #### ##       ##   ##   #########    ##    ##          ##    ## ##     ##  ##  ##  ####    ##       ##     ## ##     ## ##       
 *    ##    ##  ##       ##   ### ##       ##    ##  ##     ##    ##    ##          ##    ## ##     ##  ##  ##   ###    ##    ## ##     ## ##     ## ##       
 *     ######   ######## ##    ## ######## ##     ## ##     ##    ##    ########     ######   #######  #### ##    ##     ######   #######  ########  ######## 
 */
 async function getGroupCode(course_id, group_name) {

    const group = group_name.replace(/[^A-Z0-9]+/ig, "_")
    const uid = generateSmallID()
    const code = `gr${group}-${uid}`

    const code_query = await db.collection('codes').doc(code).get()
    if(code_query.exists === true) {
        return 0
    }


    //Regarde si on dispose deja d'un code
    // const course_query = await db.collection('courses').doc(course_id).get()
    // const group = course_query.data().groups.filter(g => g.name === group_name)

    // if(group.hasOwnProperty('join_code') && validateEmpty(group.join_code) && force_regen === false) {
    //     //on possède deja un code alors on le retourne
    //     return group.join_code
    // }

    


}

export {getGroupCode }