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
    const authorId = req.user?.id;

    const result = await postService.getMyPosts(authorId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Posts retrieved successfully",
        data: result
    })
})

const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params?.postId;

    if (!postId) {
        throw new Error("Post Id Reqired In Params")
    }

    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post retrieved successfully",
        data: result,
    })
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