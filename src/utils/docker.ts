import config from "@/config/index.ts";
// @ts-types="npm:@types/dockerode"
import Docker from "dockerode";
const dockerConfig = config.docker;

export default new Docker(dockerConfig);
