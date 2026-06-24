import { Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";


const registerUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        const user = await userService.registerUserIntoDB(payload);

        res.status(httpStatus.CREATED).json({
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User registered successfully!",
            user
        });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error",
            error: (error as Error).message,
        });
    }
}

export const userController = {
    registerUser,
};