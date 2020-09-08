global.rootDir = __dirname

const express = require("express")
const http = require("http")

const appRouter = require("./controllers/app_router")

const port = 8000
const host = "0.0.0.0"

let app = express()

app.use(appRouter)

http.createServer(app).listen(port, host)
