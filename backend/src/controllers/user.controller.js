import { ApiResponse } from '../utils/apiResponse.js'
import { ApiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'



export const createUser = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return next(new ApiError(400, "Username is required"));
        }

        const user = await User.create({ username });

        return res.json(new ApiResponse(201, "User created successfully", user))

    } catch (err) {
        return next(new ApiError(500, err.message))
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        return res.json(new ApiResponse(200, "Users fetched successfully", users))

    } catch (error) {
        return next(new ApiError(500, error.message))

    }
} 