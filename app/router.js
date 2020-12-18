const express = require("express")
const RootRouter = express.Router()

const CsvService = require("./service/csv")
const CsvRoutes = express.Router()
CsvRoutes.post("/",CsvService.uploadCsv)
CsvRoutes.get("/:csvId",CsvService.getCsvById)
CsvRoutes.post("/save",CsvService.saveNumber)
RootRouter.use("/csv",CsvRoutes)

module.exports = RootRouter