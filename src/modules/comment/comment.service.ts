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
const getCommentByAuthorId = async () => {

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