function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateEmpty(string) {
    const re = /\S/
    return re.test(string)
}

function validatePassword(password) {

    if(password.length < 6) return false
    if(!password.search(/\d/) === -1) return false
    if(!password.search(/[a-z]/) === -1) return false

    return true
}

function getDayName(string) {
    switch (string) {
        case "monday":
            return "lundi"
        case "tuesday":
            return "mardi"
        case "wednesday":
            return "mercredi"
        case "thursday":
            return "jeudi"
        case "friday":
            return "vendredi"
        case "saturday":
            return "samedi"
        case "sunday":
            return "dimanche"
    }
}

export { validateEmail, validateEmpty, validatePassword, getDayName }