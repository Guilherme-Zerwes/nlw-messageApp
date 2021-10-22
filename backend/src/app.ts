import express, { request, response } from "express";
import {router} from './routes'
import http from 'http'
import {Server, Socket} from 'socket.io'
import cors from 'cors'
import "dotenv/config"

const app = express()
app.use(cors())

const serverHttp = http.createServer(app)

const io = new Server(serverHttp, {
    cors: {
        origin: "*"
    }
})

io.on("connectio", socket => {
    console.log(`Usuário conectado no socket ${socket.id}`)
})

app.use(express.json())
app.use(router)


app.get("/github", (request,response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
})

app.get("/signin/callback", (request,response) => {
    const {code} = request.query
    return response.json(code)
})

export {serverHttp, io}