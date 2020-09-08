const express = require("express")
const monk = require("monk")
const dbHelper = require("./db_helper")
const bodyParser = require("body-parser")

let notifier = require("./notifier")

let db = monk(dbHelper.getConnectionString())

let router = express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))

let checkRoomExistence = (roomId, callback, fallback) => {
    let collection = db.get("rooms")

    if (roomId.length == 12 || roomId.length == 24){
        collection.find({
            _id: roomId
        }, {}).then( docs => {
            docs.length > 0 ? callback() : fallback()
        })
        .catch(error => {
            fallback()
        })
    }
    else {
        fallback()
    }
}

router.get("/get_messages/:room_id", (req, res) => {
    let collection = db.get(`messages`)

    collection.find({
        room_id: req.params["room_id"]
    },{
        limit: 50,
        sort: {
            datetime: 1
        }
    }).then( docs => {
        res.json(docs)
    })
    .catch(error => {
        res.status(500).send("Error while retrieving messages")
    })
})

router.get("/poll", (req, res) => {
    let reply = () => {
        notifier.removeListener("new_message", reply)
        res.end()
    }

    res.setTimeout(300000, () => {
        notifier.removeListener("new_message", reply)
    })

    notifier.on("new_message", reply)
})

router.post("/add_message/:room_id", (req, res) => {
    let collection = db.get("messages")

    let msgName = req.body["name"]
    let msgContent = req.body["content"]
    let msgRoom = req.params["room_id"]
    let msgIp = req.ip

    checkRoomExistence(msgRoom, () => {
        if (msgName && msgContent){
            collection.insert({
                name: msgName,
                content: msgContent,
                room_id: msgRoom,
                datetime: Date.now(),
                ip: msgIp
            })

            notifier.emit("new_message")

            res.send("OK")
        }
        else {
            res.status(500).send("Error while posting message")
        }
    }, () => {
        res.status(500).send("The specified room doesn't exist")
    })
})

router.get("/get_rooms", (req, res) => {
    notifier.emit("new_message")
    let collection = db.get("rooms")

    collection.find({}, {
        sort: {
            name: 1
        }
    }).then( docs => {
        res.json(docs)
    })
    .catch(error => {
        res.status(500).send("Error while retrieving rooms")
    })
})

module.exports = router
