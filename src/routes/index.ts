import { Router } from "oak";
import kuboController from "../controllers/kuboController.ts";

const router = new Router();

// 获取镜像列表
router.get("/images", kuboController.images);

// 删除镜像
router.get("/remove-image", kuboController.removeImage);

// 获取容器信息
router.get("/container", kuboController.container);

// 拉取镜像
router.get("/pull", kuboController.pull);

// 创建并启动容器
router.get("/create", kuboController.create);

// 启动容器
router.get("/start", kuboController.start);

// 停止容器
router.get("/stop", kuboController.stop);

// 转发路由
router.all("/kubo-proxy/(.*)", kuboController.forward);

export default router;
