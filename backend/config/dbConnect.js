import mongoose from "mongoose"
import chalk from 'chalk'
const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(chalk.blue.underline(`MongoDB connected: ${connect.connection.host}`))

    } catch (error) {
        console.log(error)
    }
}

export default dbConnect 