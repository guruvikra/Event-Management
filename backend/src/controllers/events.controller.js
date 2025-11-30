import dayjs from '../utils/dayjs.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { Event } from '../models/event.model.js'
import { getTimezoneInfo } from '../utils/timeZone.js'


export const createEvent = async (req, res, next) => {
    try {
        const { profiles, timeZone, startTime, endTime, createdBy } = req.body

        if (!profiles || !timeZone || !startTime || !endTime || !createdBy) {
            return next(new ApiError(400, 'All fields are required'))
        }

        // Validate timezone exists in our timezone map
        const ianaTimezone = getTimezoneInfo(timeZone);
        if (!ianaTimezone) {
            return next(new ApiError(400, 'Invalid timezone provided'))
        }
        // Store the display label (timeZone), not the IANA ID

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (end <= start) {
            return next(new ApiError(400, 'End time must be after start time'))
        }

        // Check minimum duration (15 minutes)
        const timeDiff = end - start;
        if (timeDiff < 15 * 60 * 1000) {
            return next(new ApiError(400, 'Event must be at least 15 minutes long'));
        }

        const event = await Event.create({
            profiles,
            timeZone: timeZone, // Store the display label, not IANA ID
            createdBy: createdBy,
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
        }).populate('profiles', 'username').lean();

        let displayTimezone
        if (timeZone) {
            displayTimezone = getTimezoneInfo(timeZone) || timeZone;
        }

        const data = events.map(event => {
            return {
                ...event,
                startTime: dayjs
                    .utc(event.startTime)
                    .tz(displayTimezone)
                    .format("YYYY-MM-DD h:mm A"),
                endTime: dayjs
                    .utc(event.endTime)
                    .tz(displayTimezone)
                    .format("YYYY-MM-DD h:mm A"),
                logs: event.logs.map(log => ({
                    ...log,
                    at: dayjs.utc(log.at).tz(displayTimezone).format("YYYY-MM-DD h:mm A")
                })),
                createdAt: dayjs.utc(event.createdAt).tz(displayTimezone).format("YYYY-MM-DD h:mm A"),
                updatedAt: dayjs.utc(event.updatedAt).tz(displayTimezone).format("YYYY-MM-DD h:mm A"),
                displayTimezone: displayTimezone
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

        if (!id) return next(new ApiError(400, "Invalid event id"));

        const event = await Event.findById(id);
        if (!event) return next(new ApiError(404, "Event not found"));

        const updateObj = {};
        const logs = [];

        const isTimezoneChanged = timeZone && timeZone !== event.timeZone;
        const isTimeProvided = startTime || endTime;

        /* ✅ Profiles */
        if (
            profiles &&
            JSON.stringify(profiles) !== JSON.stringify(event.profiles)
        ) {
            updateObj.profiles = profiles;
            logs.push(
                `profiles: ${event.profiles.join(", ")} → ${profiles.join(", ")}`
            );
        }

        /* ✅ Timezone */
        if (isTimezoneChanged) {
            const ianaTimezone = getTimezoneInfo(timeZone);
            if (!ianaTimezone) {
                return next(new ApiError(400, "Invalid timezone provided"));
            }

            updateObj.timeZone = timeZone;
            logs.push(`timezone: ${event.timeZone} → ${timeZone}`);
        }

        /* ✅ Start Time (only if user REALLY changed time) */
        if (
            startTime &&
            !isTimezoneChanged && // ✅ IMPORTANT
            +new Date(startTime) !== +event.startTime
        ) {
            const newStart = new Date(startTime);
            updateObj.startTime = newStart;
            logs.push(
                `startTime: ${event.startTime.toISOString()} → ${newStart.toISOString()}`
            );
        }

        /* ✅ End Time (only if user REALLY changed time) */
        if (
            endTime &&
            !isTimezoneChanged && // ✅ IMPORTANT
            +new Date(endTime) !== +event.endTime
        ) {
            const newEnd = new Date(endTime);
            updateObj.endTime = newEnd;
            logs.push(
                `endTime: ${event.endTime.toISOString()} → ${newEnd.toISOString()}`
            );
        }

        /* ✅ Time validation */
        const finalStart = updateObj.startTime || event.startTime;
        const finalEnd = updateObj.endTime || event.endTime;

        if (finalEnd <= finalStart) {
            return next(new ApiError(400, "End time must be after start time"));
        }

        if (!logs.length) {
            return res.json(
                new ApiResponse(200, "No changes detected", { updated: false })
            );
        }

        await Event.updateOne(
            { _id: id },
            {
                $set: updateObj,
                $push: {
                    logs: {
                        description: logs.join(" | "),
                        at: new Date()
                    }
                }
            }
        );

        return res.json(
            new ApiResponse(200, "Event updated successfully", { updated: true })
        );
    } catch (err) {
        return next(new ApiError(500, err.message));
    }
};



// export const updateEvent = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { profiles, timeZone, startTime, endTime } = req.body;

//         if (!id) {
//             return next(new ApiError(400, "Invalid event id"));
//         }

//         const updateObj = {};
//         const changedFields = [];

//         if (profiles) {
//             updateObj.profiles = profiles;
//             changedFields.push("profiles");
//         }

//         if (timeZone) {
//             const ianaTimezone = getTimezoneInfo(timeZone);
//             if (!ianaTimezone) {
//                 return next(new ApiError(400, 'Invalid timezone provided'));
//             }
//             updateObj.timeZone = timeZone;
//             changedFields.push("timeZone");
//         }

//         if (startTime) {
//             updateObj.startTime = new Date(startTime);
//             changedFields.push("start Date/Time Updated");
//         }

//         if (endTime) {
//             updateObj.endTime = new Date(endTime);
//             changedFields.push("end Date/Time Updated");
//         }

//         if (startTime && endTime) {
//             const start = new Date(startTime);
//             const end = new Date(endTime);

//             if (end <= start) {
//                 return next(new ApiError(400, 'End time must be after start time'));
//             }
//         }

//         if ((startTime || endTime) && !startTime || !endTime) {
//             const existingEvent = await Event.findById(id);
//             if (existingEvent) {
//                 const start = startTime ? new Date(startTime) : existingEvent.startTime;
//                 const end = endTime ? new Date(endTime) : existingEvent.endTime;

//                 if (end <= start) {
//                     return next(new ApiError(400, 'End time must be after start time'));
//                 }

//             }
//         }

//         const result = await Event.updateOne(
//             { _id: id },
//             {
//                 $set: updateObj,
//                 $push: {
//                     logs: {
//                         description: `${changedFields.join(", ")}`,
//                         at: new Date()
//                     }
//                 }
//             }
//         );

//         const isUpdated = result.matchedCount > 0 && result.modifiedCount > 0;

//         if (!isUpdated) {
//             return res.json(
//                 new ApiResponse(404, "Event not updated", { updated: false })
//             );
//         }

//         return res.json(
//             new ApiResponse(200, "Event updated successfully", { updated: true })
//         );

//     } catch (error) {
//         return next(new ApiError(500, error.message));
//     }
// };

// export const updateEvent = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const { profiles, timeZone, startTime, endTime } = req.body;

//         if (!id) {
//             return next(new ApiError(400, "Invalid event id"));
//         }

//         const existingEvent = await Event.findById(id);
//         if (!existingEvent) {
//             return next(new ApiError(404, "Event not found"));
//         }

//         const updateObj = {};
//         const changedFields = [];

//         if (profiles) {
//             updateObj.profiles = profiles;
//             changedFields.push(
//                 `profiles updated from ${JSON.stringify(existingEvent.profiles)} to ${JSON.stringify(profiles)}`
//             );
//         }

//         if (timeZone) {
//             const ianaTimezone = getTimezoneInfo(timeZone);
//             if (!ianaTimezone) {
//                 return next(new ApiError(400, "Invalid timezone provided"));
//             }

//             changedFields.push(
//                 `timezone updated from ${existingEvent.timeZone} to ${timeZone}`
//             );

//             updateObj.timeZone = timeZone;
//         }

//         if (startTime) {
//             updateObj.startTime = new Date(startTime);
//             changedFields.push(
//                 `startTime updated from ${existingEvent.startTime?.toISOString()} to ${new Date(startTime).toISOString()}`
//             );
//         }

//         if (endTime) {
//             updateObj.endTime = new Date(endTime);
//             changedFields.push(
//                 `endTime updated from ${existingEvent.endTime?.toISOString()} to ${new Date(endTime).toISOString()}`
//             );
//         }

//         const newStart = startTime ? new Date(startTime) : existingEvent.startTime;
//         const newEnd = endTime ? new Date(endTime) : existingEvent.endTime;

//         if (newEnd <= newStart) {
//             return next(new ApiError(400, "End time must be after start time"));
//         }

//         const result = await Event.updateOne(
//             { _id: id },
//             {
//                 $set: updateObj,
//                 $push: {
//                     logs: {
//                         description: changedFields.join(" | "),
//                         at: new Date()
//                     }
//                 }
//             }
//         );

//         const isUpdated = result.matchedCount > 0 && result.modifiedCount > 0;

//         if (!isUpdated) {
//             return res.json(new ApiResponse(404, "Event not updated", { updated: false }));
//         }

//         return res.json(new ApiResponse(200, "Event updated successfully", { updated: true }));

//     } catch (error) {
//         return next(new ApiError(500, error.message));
//     }
// };

