import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { TIMEZONE_MAP } from '../utils/timeZone.js'


export const getTimezoneInfo = async (req, res, next) => {
    try {

        return res.json(new ApiResponse(200, 'Timezone info fetched successfully', Array.from(TIMEZONE_MAP.keys())));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
};


export const getTimezoneInfoByKey = async (req, res, next) => {
    try {
        const { key } = req.params;
        const timezone = TIMEZONE_MAP.get(key);
        if (!timezone) {
            return next(new ApiError(404, 'Timezone not found'));
        }
        return res.json(new ApiResponse(200, 'Timezone info fetched successfully', timezone));
    } catch (error) {
        return next(new ApiError(500, error.message));
    }
};
