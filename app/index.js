require("dotenv").config({ path: `${process.env.NODE_ENV}.env` })
const http = require("http")
const express = require("express")
const fileParser = require("express-fileupload")
const cookieParser = require("cookie-parser")
const app = express()

const env = process.env

const httpServer = http.createServer(app)

require("./utils/mysql").Client.connect((error)=>{
    if(error) console.error(error)
})

require("./utils/redis").Client.start()

httpServer.listen(env.APP_SERVER_PORT,()=>{
    console.log(`App Started On PORT ${env.APP_SERVER_PORT}`)
})

app.use(cookieParser())
app.use(fileParser())
app.use(express.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");
    res.header("Access-Control-Max-Age", 86400);
    next();
}); 

app.use(require("./router"))
app.use((err, req, res, next) => {
    if (typeof err.error === "object" && typeof err.error.message === "string" && typeof err.error.code === "string") {
        err.message = err.error.message;
        err.error = err.error.code;
    } else {
        err.message = err.error;
        err.error = "UNEXPECTED_ERROR";
    }
    console.debug(`Responsed Error '${err.message}'`);
    const statusCode = err.statusCode || 500;
    delete err.statusCode;
    return res.status(statusCode).json(err);
});