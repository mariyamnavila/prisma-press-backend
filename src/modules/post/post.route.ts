import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()

router.post("/", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.createPost)
router.get("/", postController.getAllPosts)
router.get("/stats", auth(Role.ADMIN), postController.getPostsStats)
router.get("/my-posts", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.getMyPosts)
router.get("/:postId", postController.getPostById)
router.patch("/:postId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.updatePostById)
router.delete("/:postId", auth(Role.ADMIN, Role.USER, Role.AUTHOR), postController.deletePostById)

export const postRoutes = router;