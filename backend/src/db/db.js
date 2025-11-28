import mongoose from "mongoose";

const connectToDb = async () => {

    try {
        // console.log(process.env.MONGODB_URI);

        const connection = await mongoose.connect(`${process.env.MONGODB_URI}`)
        // console.log(connection.connection.host);
    } catch (error) {
        console.error("Failed to connect to MongoDB", error.message);
        // throw error;
        process.exit(1);
    }
}

// connectToDb()

export default connectToDb

// import mongoose from "mongoose";

// const connectToDb = async () => {
//     try {
//         // ⚠️ SECURITY WARNING: Do not console.log the URI in production
//         // It exposes your password to the logs.
//         // console.log(process.env.MONGODB_URI);

//         const connection = await mongoose.connect('mongodb+srv://guruvikram886326:Vikramguru326@cluster0.lduit00.mongodb.net/?appName=Cluster0');
//         console.log(`✅ Connected to: ${connection.connection.host}`);
//     } catch (error) {
//         console.error("❌ CONNECTION FAILED");

//         // 1. This prints the "Friendly" error (the one you are seeing)
//         console.error("Summary:", error.message);

//         // 2. This prints the REAL technical reason (what you need)
//         if (error.reason) {
//             console.error("Reason:", error.reason);
//         } else {
//             // Prints the full deep error structure
//             console.dir(error, { depth: null, colors: true });
//         }

//         process.exit(1);
//     }
// }

// export default connectToDb;