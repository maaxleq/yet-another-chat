const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing')

let router = express.Router()

let loader = new TwingLoaderFilesystem(path.join(`${global.rootDir}/public/templates`))
let twing = new TwingEnvironment(loader)

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

router.get("/font/:file", (req, res) => {
    res.sendFile(path.join(`${global.rootDir}/public/fonts/${req.params.file}.ttf`))
})

router.get("/css/:file", (req, res) => {
    res.set("Content-Type", 'text/css')
    res.sendFile(path.join(`${global.rootDir}/public/css/${req.params.file}.css`))
})

router.get("/js/:file", (req, res) => {
    res.sendFile(path.join(`${global.rootDir}/public/js/${req.params.file}.js`))
})

router.get("/png/:file", (req, res) => {
    res.sendFile(path.join(`${global.rootDir}/public/img/${req.params.file}.png`))
})

router.get("/svg/:file", (req, res) => {
    res.sendFile(path.join(`${global.rootDir}/public/img/${req.params.file}.svg`))
})

router.get("/", (req, res) => {
    twing.render("welcome.twig").then(output => {
        res.end(output)
    })
})

router.post("/dashboard", (req, res) => {
    twing.render("dashboard.twig", req.body).then(output => {
        res.end(output)
    })
})

router.post("/chat", (req, res) => {
    let [rId, rName] = req.body.room.split(";;")

    twing.render("chat.twig", {
        name: req.body.name,
        roomId: rId,
        roomName: rName
    }).then(output => {
        res.end(output)
    })
})

router.renderBan = (banInfo, res) => {
    twing.render("ban.twig", banInfo).then(output => {
        res.end(output)
    })
}

module.exports = router
