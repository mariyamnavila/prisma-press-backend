import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { PostWhereInput } from "../../../generated/prisma/models"
import { prisma } from "../../lib/prisma"
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface"

const createPost = async (payload: ICreatePostPayload, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result
}


const getAllPosts = async (query: IPostQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const tags = query.tags ? JSON.parse(query.tags as string) : null;

    const tagsArray = Array.isArray(tags) ? tags : [];

    const andConditions: PostWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: query.searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        })
    }

    if (query.title) {
        andConditions.push({
            title: query.title
        })
    }
    if (query.content) {
        andConditions.push({
            content: query.content
        })
    }
    if (query.authorId) {
        andConditions.push({
            authorId: query.authorId
        })
    }
    if (query.isFeatured) {
        andConditions.push({
            isFeatured: Boolean(query.isFeatured)
        })
    }
    if (query.tags) {
        andConditions.push({
            tags: {
                hasSome: tagsArray,
            },
        });
    }

    const posts = await prisma.post.findMany({
        // ? filtering / exact match without AND operator
        // where: {
        //     title: "My fouth Post",
        //     content: "Ronaldo",
        // },

        // ? filtering / exact match with AND operator
        // where: {
        //     AND: [
        //         {
        //             title: "My fouth Post",
        //         },
        //         {
        //             content: "Ronaldo",
        //         },
        //         {
        //             tags: {
        //                 // equals:[
        //                 //     "typescript",
        //                 //     "prisma",
        //                 //     "express"
        //                 // ],
        //                 has: "prisma",
        //             },
        //         },
        //     ],
        // },

        // ? searching / partial match
        // where: {
        //     title: {
        //         contains: "second",
        //         mode: "insensitive"
        //     },
        // ? X -> not ideal for partial match
        // content: {
        //     contains: "Content"
        // }
        // },

        // ? partial search with OR operator
        // where: {
        //     OR: [
        //         {
        //             title: {
        //                 contains: "second",
        //                 mode: "insensitive"
        //             },
        //         },
        //         {
        //             content: {
        //                 contains: "content",
        //                 mode: "insensitive",
        //             },
        //         },
        //     ],
        // },

        // ? combining search and filtering
        // where: {
        //     AND: [
        //         {
        //             // searching
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: "first",
        //                         mode: "insensitive",
        //                     },
        //                 },
        //                 {
        //                     content: {
        //                         contains: "Con",
        //                         mode: "insensitive",
        //                     }
        //                 }
        //             ],
        //         },
        //         // filtering
        //         {
        //             title: "The Second Post",
        //         },
        //         {
        //             content: "Content"
        //         }
        //     ]
        // },

        // ? Pagination with limit or take and skip or page
        // take: 2,
        // for first page skip is 0
        // skip: 1, // visiting page 2
        // skip: 2, // visiting page 3
        // ? page = 4, limit/ take = 1, skip : (page-1)*limit =>
        // ? page = 3, limit/ take = 10, skip : (page-1)*limit = (3-1)*10 = 20

        // sorting in ascending or descending order on specific fields
        // orderBy: {
        //     createdAt: "desc",
        //     title: "asc",
        //     content: "desc"
        // },

        // // ? dynamic searching, filtering
        // where: {
        //     AND: [

        //         query.searchTerm ? {
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: query.searchTerm,
        //                         mode: "insensitive",
        //                     },
        //                 },
        //                 {
        //                     content: {
        //                         contains: query.searchTerm,
        //                         mode: "insensitive",
        //                     },
        //                 },
        //             ],
        //         } : {},

        //         // title filtering
        //         query.title ? { title: query.title } : {},

        //         // content filtering
        //         query.content ? { title: query.content } : {}
        //     ],
        // },


        where: {
            AND: andConditions,
        },

        //? dynamic pagination and sorting
        take: limit,
        skip: skip,

        orderBy: {
            // sortBy: sortOrder
            [sortBy]: sortOrder,
        },

        include: {
            author: {
                omit: {
                    password: true,
                }
            },
            comments: true,
        }
    })
    return posts
}

const getMyPosts = async (authorId: string) => {
    const result = await prisma.post.findMany({
        where: {
            authorId,
        },

        orderBy: {
            createdAt: "desc",
        },

        include: {
            comments: true,
            author: {
                omit: {
                    password: true,
                },
            },
            _count: {
                select: {
                    comments: true
                },
            }
        }
    })

    return result
}

const getPostsStats = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            // const totalPosts = await tx.post.count();

            // const totalPublishedPosts = await tx.post.count({
            //     where: {
            //         status: PostStatus.PUBLISHED,
            //     },
            // })
            // const totalDraftPosts = await tx.post.count({
            //     where: {
            //         status: PostStatus.DRAFT,
            //     },
            // })
            // const totalArchivedPosts = await tx.post.count({
            //     where: {
            //         status: PostStatus.ARCHIVED,
            //     },
            // })

            // const totalComments = await tx.comment.count();

            // const totalApprovedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.APPROVED,
            //     },
            // })

            // const totalRejectedComments = await tx.comment.count({
            //     where: {
            //         status: CommentStatus.REJECT,
            //     },
            // })

            // // not a good approach
            // // const allPosts = await tx.post.findMany();
            // // let totalPostViews = 0

            // // allPosts.forEach((post) => {
            // //     totalPostViews = totalPostViews + post.views
            // // })

            // const totalPostViewsAggregate = await tx.post.aggregate({
            //     _sum: {
            //         views: true,
            //     }
            // })

            // const totalPostViews = totalPostViewsAggregate._sum.views

            // return {
            //     totalPosts,
            //     totalPublishedPosts,
            //     totalDraftPosts,
            //     totalArchivedPosts,
            //     totalComments,
            //     totalApprovedComments,
            //     totalRejectedComments,
            //     totalPostViews,
            // }

            const [
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViewsAggregate,
            ] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({
                    where: {
                        status: PostStatus.PUBLISHED,
                    },
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.DRAFT,
                    },
                }),
                await tx.post.count({
                    where: {
                        status: PostStatus.ARCHIVED,
                    },
                }),
                await tx.comment.count(),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.APPROVED,
                    },
                }),
                await tx.comment.count({
                    where: {
                        status: CommentStatus.REJECT,
                    },
                }),
                await tx.post.aggregate({
                    _sum: {
                        views: true,
                    }
                }),
            ])

            return {
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews: totalPostViewsAggregate._sum.views,
            }
        }
    )
    return transactionResult;

}

const getPostById = async (postId: string) => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {
            const existingPost = await tx.post.findUnique({
                where: {
                    id: postId,
                },
                select: {
                    id: true,
                },
            })

            if (!existingPost) {
                throw new Error("Post not found")
            }

            await tx.post.update({
                where: {
                    id: postId,
                },
                data: {
                    views: {
                        increment: 1,
                    },
                },
            })

            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId,
                },
                include: {
                    author: {
                        omit: {
                            password: true,
                        },
                    },

                    comments: {
                        where: {
                            status: CommentStatus.APPROVED,
                        },

                        orderBy: {
                            createdAt: "desc",
                        },
                    },

                    _count: {
                        select: {
                            comments: true,
                        },
                    },
                },
            })

            return post;
        }
    )

    return transactionResult;
}

const updatePostById = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post")
    }

    const result = await prisma.post.update({
        where: {
            id: postId,
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true,
                },
            },
            comments: true
        },
    })

    return result;
}
const deletePostById = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You are not the owner of this post")
    }

    await prisma.post.delete({
        where: {
            id: postId,
        },
    })
}

export const postService = {
    createPost,
    getAllPosts,
    getMyPosts,
    getPostsStats,
    getPostById,
    updatePostById,
    deletePostById,
}