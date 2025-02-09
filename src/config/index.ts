const config = {
	token: Deno.env.get("APP_TOKEN") ?? "IPFS-GATEKEEPER-TOKEN",
	whitelist: { api: Deno.env.get("WHITE_STATUS_API"), token: Deno.env.get("WHITE_STATUS_TOKEN") },
	docker: { host: "127.0.0.1", port: 2375, version: "v1.46" },
	kuboContainerName: "ipfs_container",
};
export default config;
