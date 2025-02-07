import { Router } from "oak";
import ipfsController from "../controllers/ipfsController.ts";

const router = new Router();

// ipfs获取文件
router.get("/ipfs/(.*)", ipfsController.get);

export default router;
