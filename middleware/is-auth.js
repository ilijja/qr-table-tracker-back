const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split('Bearer')[1].trim()

    let decodedToken; 

    try {
        decodedToken = jwt.decode(token, 'promenisecretkasnije')

    } catch(err) {
        err.status = 500
        throw err
    }

    if(!decodedToken){
        const error = new Error("Not authenticated")
        error.status = 401
        throw error
    }

    req.userId = decodedToken.userId;
    next()
}