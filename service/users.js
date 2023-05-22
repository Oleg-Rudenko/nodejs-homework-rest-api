const User = require('./schema/user')

const getUser = async (body) => User.findOne(body)

module.exports = { getUser }