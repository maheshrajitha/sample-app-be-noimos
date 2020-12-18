const {v1 : uuidV1} = require("uuid")
const csvParser = require("csvtojson")
const { set , get } = require("../utils/redis").Client
const { AppError : Error , CommonError } = require("../utils/error")
const { executeWithDataAsync } = require("../utils/mysql").Client

module.exports={
    async uploadCsv(req,res,next){
        console.log(req.files);
        if(req.files !== null && typeof req.files.csv !== "undefined"){
            try{
                let fileId = uuidV1()
                await req.files.csv.mv(`${__dirname}/csvfiles/${fileId}.csv`)
                let csvJsonData = await csvParser().fromFile(`${__dirname}/csvfiles/${fileId}.csv`)
                let valiedCsv = csvJsonData.filter((csv,index)=>{
                    csv.number = csv.number.replace("+94",0)
                    return index === csvJsonData.findIndex(d=> {
                       d.number = ( d.number[0] == 7 && d.number.length == 9) ? `0${d.number}`:d.number
                        return d.number === csv.number && d.number.length === 10
                    })
                })
                set(fileId,JSON.stringify(valiedCsv),(cacheError)=>{
                    if(cacheError) next(new Error(CommonError.CACHE_ERROR,cacheError,500))
                    else res.send({
                        id: fileId,
                        data: valiedCsv
                    })
                })
            }catch(error){
                console.log(error);
                next(new Error(CommonError.INVALID_REQUEST,error,500))
            }
        }else next(new Error(CommonError.INVALID_REQUEST,"CSV File Missing",400))
    },

    getCsvById(req,res,next){
        if(typeof req.params.csvId !== "undefined" && req.params.csvId !== ""){
            get(req.params.csvId,(cacheError,result)=>{
                if(cacheError)
                    next(new Error(CommonError.CACHE_ERROR,cacheError,500))
                else if(result == null || typeof result ==="undefined" || result.length == 0 )
                    next(new Error(CommonError.PAGE_NOT_FOUND,"No Data",404))
                else res.send(JSON.parse(result))
            })
        }else next(new Error(CommonError.INVALID_REQUEST,"Request Data Missing",400))
    },

    async saveNumber(req,res,next){
        if(typeof req.body.number !== "undefined"){
            try{
                await executeWithDataAsync(`INSERT INTO phone_numbers SET ?`,{number: req.body.number})
                res.send({
                    saved:true
                })
            }catch(error){
                next(new Error(CommonError.DATABASE_ERROR,error,500))
            }
        }else next(new Error(CommonError.INVALID_REQUEST,"Request Data Missing",400))
    }
}