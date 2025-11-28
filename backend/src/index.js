import dotenv from 'dotenv'
dotenv.config({
    path: "../.env"
});
import connectToDb from './db/db.js'
import { app } from './app.js'

// console.log(process.env.PORT)
connectToDb().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.log(err)
})

