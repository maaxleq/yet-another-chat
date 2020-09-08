const dotenv = require("dotenv").config()

let helper = {}

helper.getConnectionString = () => `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`

module.exports = helper