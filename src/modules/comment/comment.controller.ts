import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import { commentService } from "./comment.service";
import sendResponse from "../../utils/SendResponse";
import httpStatus from 'http-status';

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const payload = req.body;
    const result = await commentService.createComment(payload, authorId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment created successfully",
        data: result
    })

})

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const getCommentByCommentId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const moderateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment,
}