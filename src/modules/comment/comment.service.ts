import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface"

const createComment = async (payload: ICreateCommentPayload, authorId: string) => {

    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postId,
        },
    })

    const result = await prisma.comment.create({
        data: {
            ...payload,
            authorId,
        },
    })

    return result
}
const getCommentByAuthorId = async (authorId: string) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: authorId,
        },
    })

    const allCommentsByAuthor = await prisma.comment.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    })

    return allCommentsByAuthor
}

const getCommentByCommentId = async (commentId: string) => {

    const result = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true,
                    views: true,
                }
            }
        }
    })

    return result
}

const updateComment = async (payload: IUpdateCommentPayload, commentId: string, authorId: string, isAdmin: boolean) => {

    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
        },
    })

    if (!isAdmin && comment.authorId !== authorId) {
        throw new Error("You are not the owner of this post")
    }

    const result = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            content: payload.content
        },
    })

    return result;
}

const deleteComment = async () => {

}

export const commentService = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
}