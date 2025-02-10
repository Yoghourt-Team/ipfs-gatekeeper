const config = {
	token: Deno.env.get("APP_TOKEN") ?? "IPFS-GATEKEEPER-TOKEN",
	whitelist: { api: Deno.env.get("WHITE_STATUS_API"), token: Deno.env.get("WHITE_STATUS_TOKEN") },
	docker: { host: "host.docker.internal", port: 2375, version: "v1.24" },
	kuboContainerName: "ipfs_container",
};
export default config;
