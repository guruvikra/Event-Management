import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/error.middleware.js";


const app = express();

app.use(cors());
app.use(express.json());


import userRoutes from "./routes/user.route.js"
import eventRoutes from "./routes/event.route.js"
import timeZoneRoutes from "./routes/timeZone.route.js"


app.use('/api/v1/users', userRoutes)
app.use('/api/v1/events', eventRoutes)
app.use('/api/v1/timeZones', timeZoneRoutes)

app.use(errorHandler);

export {
    app
}
