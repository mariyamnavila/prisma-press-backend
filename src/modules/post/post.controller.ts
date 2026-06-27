import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { postService } from "./post.service";
import httpStatus from "http-status";
import sendResponse from "../../utils/SendResponse";

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const id = req.user?.id;

    const payload = req.body;

    const result = await postService.createPost(payload, id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post Created Successfully",
        data: result
    })

})

const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Posts retrieved successfully",
        data: result
    })
})

const getPostsStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const updatePostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

const deletePostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export const postController = {
    getAllPosts,
    createPost,
    getPostsStats,
    getMyPosts,
    getPostById,
    updatePostById,
    deletePostById,
}