const express = require("express")
const monk = require("monk")

const chat = require("./chat_controller")
const auth = require("./auth_controller")
const render = require("./render_controller")

let router = express.Router()

router.use(auth.authorize)
router.use("/api", chat)
router.use("/", render)

module.exports = router
