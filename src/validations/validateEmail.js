let validateEmail = function (email){
    let result = email.match(/^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/)
    return result
}

module.exports = validateEmail