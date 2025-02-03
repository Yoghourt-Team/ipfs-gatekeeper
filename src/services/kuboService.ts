import docker from "@/utils/docker.ts";
import config from "@config";

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
