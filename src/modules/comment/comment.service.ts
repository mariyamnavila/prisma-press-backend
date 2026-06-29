import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload } from "./comment.interface"

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

const getCommentByCommentId = async () => {

}

const updateComment = async () => {

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