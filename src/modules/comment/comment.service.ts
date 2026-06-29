import { prisma } from "../../lib/prisma";
import { ICommentStatus, ICreateCommentPayload, IUpdateCommentPayload } from "./comment.interface"

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

const updateComment = async (payload: IUpdateCommentPayload, commentId: string, authorId: string) => {

    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId,
        },
    })

    const result = await prisma.comment.update({
        where: {
            id: commentId,
            authorId
        },
        data: payload
    })

    return result;
}

const deleteComment = async (commentId: string, authorId: string) => {

    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
            authorId,
        },
    })

    await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
        },
    })

    await prisma.comment.delete({
        where: {
            id: commentId
        }
    })
}

const moderateComment = async (payload: ICommentStatus, commentId: string) => {
    const { status } = payload;

    const comment = await prisma.comment.findUniqueOrThrow({
        where: {
            id: commentId,
        },
    })

    if (status === comment.status) {
        throw new Error("This status is already given")
    }

    const result = await prisma.comment.update({
        where: {
            id: commentId
        },
        data: {
            status
        }
    })

    return result
}

export const commentService = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment,
}