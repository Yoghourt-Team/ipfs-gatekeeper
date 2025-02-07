import docker from "@/utils/docker.ts";
import config from "@config";
// @ts-types="npm:@types/tar-stream"
import tarStream from "tar-stream";

export default {
	// 获取镜像列表
	async getImageList() {
		const list = await docker.listImages({ all: true });
		return list;
	},
	// 删除镜像
	async removeImage(id: string) {
		const stream = await docker.getImage(id).remove();
		return stream;
	},
	// 拉取kubo镜像
	async pullImage(tag: string) {
		const stream = await docker.pull("ipfs/kubo:" + tag);

		return stream;
	},
	// 获取kubo容器
	async checkKuboContainer() {
		const containers = await docker.listContainers({ all: true, filters: { name: [config.kuboContainerName] } });
		return containers[0];
	},
	// 创建并启动容器
	async createAndStartContainer(tag: string) {
		const container = await docker.createContainer({
			name: "ipfs_container",
			Image: "ipfs/kubo:" + tag,
			HostConfig: {
				RestartPolicy: {
					Name: "always",
				},
				PortBindings: {
					"4001/tcp": [{ HostPort: "4001" }],
					"4001/udp": [{ HostPort: "4001" }],
					"8080/tcp": [{ HostPort: "8080" }],
					"5001/tcp": [{ HostPort: "5001" }],
				},
				Binds: ["/ipfs:/data/ipfs"],
			},
			ExposedPorts: {
				"4001/tcp": {},
				"4001/udp": {},
				"8080/tcp": {},
				"5001/tcp": {},
			},
		});
		// 启动容器
		await container.start();

		return container;
	},
	// 读取kubo配置文件
	async getKuboConfig(id: string) {
		const container = docker.getContainer(id);
		const rStream = await container.getArchive({ path: "/data/ipfs/config" });

		return new Promise((resolve, reject) => {
			// 创建 tar 提取器
			const extract = tarStream.extract();
			let fileContent = "";

			// 监听 tar 流中的文件数据
			extract.on("entry", (_header, s, next) => {
				s.on("data", (chunk: { toString: () => string }) => {
					fileContent += chunk.toString(); // 收集文件内容
				});

				s.on("end", () => {
					next(); // 继续处理下一个文件（如果有）
				});

				s.resume(); // 确保流继续流动
			});

			// 当 tar 提取完成时
			extract.on("finish", () => {
				try {
					// 将文件内容转换为 JSON
					const jsonData = JSON.parse(fileContent);
					resolve(jsonData);
				} catch (error) {
					reject("Failed to parse file content as JSON:" + error);
				}
			});

			// 将 Docker 返回的流传递给 tar 提取器
			rStream.pipe(extract);
		});
	},
	// 覆盖kubo配置文件
	async overrideKuboConfig(id: string, content: string) {
		// 容器内目标文件路径
		const containerFilePath = "/data/ipfs";

		// 获取容器实例
		const container = docker.getContainer(id);
		// 创建一个tar
		const pack = tarStream.pack();
		pack.entry({ name: "config" }, content);
		pack.finalize();

		// 将文件内容写入容器
		await container.putArchive(pack, { path: containerFilePath });
	},
	// 启动容器
	async startKuboContainer(id: string) {
		const container = docker.getContainer(id);
		await container.start();
	},
	// 停止容器
	async stopKuboContainer(id: string) {
		const container = docker.getContainer(id);
		await container.stop();
	},
	// 移除容器
	async removeContainer(id: string) {
		const container = docker.getContainer(id);
		await container.remove();
	},
};
