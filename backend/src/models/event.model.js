import { Schema, model } from "mongoose";



// const EventLogSchema = new Schema({
//     description: {
//         type: String
//     },
//     at: {
//         type: Date, default: Date.now
//     }
// });

const EventLogSchemaDef = {
    description: { type: String },
    at: { type: Date, default: Date.now }
};

const eventSchema = new Schema({
    profiles: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    timeZone: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return this.startTime <= value;
            },
            message: 'End time must be after start time'
        }
    },
    logs: [EventLogSchemaDef]
},
    {
        timestamps: true
    })


export const Event = model("Event", eventSchema)