import path from 'path'
import express from 'express'
import history from 'connect-history-api-fallback'
import { frontendPort } from '../src/utils/portUtils'
require('dotenv').config()

const app = express()

app.use(history())
app.use(express.static(path.join(__dirname, '../build')))

app.listen(process.env.REACT_TESTING_PORT | 3000)
