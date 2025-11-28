import dayjs from '../utils/dayjs.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { Event } from '../models/event.model.js'
import { getTimezoneInfo } from '../utils/timeZone.js'


export const createEvent = async (req, res, next) => {
    try {
        const { profiles, timeZone, startTime, endTime } = req.body

        if (!profiles || !timeZone || !startTime || !endTime) {
            return next(new ApiError(400, 'All fields are required'))
        }
        if (new Date(startTime) > new Date(endTime)) {
            return next(new ApiError(400, 'End time must be after start time'))
        }

        const event = await Event.create({
            profiles,
            timeZone,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        })

        return res.json(new ApiResponse(201, 'Event created successfully', event))

    } catch (error) {
        return next(new ApiError(500, error.message))
    }
}

export const getUserEvents = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { timeZone } = req.query

        if (!id) {
            return next(new ApiError(400, 'Invalid user id'));
        }

        const events = await Event.find({
            profiles: id
        }).lean();

        const data = events.map(event => {
            const currTimeZone = getTimezoneInfo(timeZone) || event.timeZone;
            console.log(currTimeZone)

            return {
                ...event,
                startTime: dayjs
                    .utc(event.startTime)
                    .tz(currTimeZone)
                    .format("YYYY-MM-DD HH:mm"),
                endTime: dayjs
                    .utc(event.endTime)
                    .tz(currTimeZone)
                    .format("YYYY-MM-DD HH:mm"),
                logs: event.logs.map(log => ({
                    ...log,
                    at: dayjs.utc(log.at).tz(currTimeZone).format("YYYY-MM-DD HH:mm")
                })),

                createdAt: dayjs.utc(event.createdAt).tz(currTimeZone).format("YYYY-MM-DD HH:mm"),
                updatedAt: dayjs.utc(event.updatedAt).tz(currTimeZone).format("YYYY-MM-DD HH:mm")
            }
        });

        return res.json(new ApiResponse(200, 'Events fetched successfully', data))

    } catch (error) {
        return next(new ApiError(500, error.message))
    }
};


export const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { profiles, timeZone, startTime, endTime } = req.body;

        if (!id) {
            return next(new ApiError(400, "Invalid event id"));
        }

        const updateObj = {};
        const changedFields = [];

        if (profiles) {
            updateObj.profiles = profiles;
            changedFields.push("profiles");

        }
        if (timeZone) {
            updateObj.timeZone = timeZone;
            changedFields.push("timeZone");

        }
        if (startTime) {
            updateObj.startTime = new Date(startTime);
            changedFields.push("start Date/Time Updated");

        }
        if (endTime) {
            updateObj.endTime = new Date(endTime);
            changedFields.push("end Date/Time Updated");

        }

        const result = await Event.updateOne(
            { _id: id },
            {
                $set: updateObj,
                $push: {
                    logs: {
                        description: `${changedFields.join(", ")}`,
                        at: new Date()
                    }
                }
            }
        );

        const isUpdated =
            result.matchedCount > 0 && result.modifiedCount > 0;

        if (!isUpdated) {
            return res.json(
                new ApiResponse(404, "Event not updated", { updated: false })
            );
        }

        return res.json(
            new ApiResponse(200, "Event updated successfully", { updated: true })
        );

    } catch (error) {
        return next(new ApiError(500, error.message));
    }
};
