const express = require("express")
const monk = require("monk")
const path = require("path")

const dbHelper = require("./db_helper")
const render = require("./render_controller")

let db = monk(dbHelper.getConnectionString())

let controller = {}

controller.authorize = (req, res, next) => {
    if (req.path.includes("/ban") || req.path.includes("/css") || req.path.includes("/js") || req.path.includes("/font") || req.path.includes("/png")){
        next()
    }
    else {
        let userIp = req.ip
        let collection = db.get("banned_ips")
    
        collection.find({
            ip: userIp
        },{}).then( docs => {
            if (docs.length == 0){
                next()
            }
            else {
                render.renderBan(docs[0], res)
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).send("Error while authorizing your IP")
        })
    }
}

module.exports = controller