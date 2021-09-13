import path from 'path'
import express from 'express'
require('dotenv').config()

const app = express()

app.use(express.static(path.join(__dirname, '../build')))

app.listen(process.env.REACT_TESTING_PORT | 3000)
