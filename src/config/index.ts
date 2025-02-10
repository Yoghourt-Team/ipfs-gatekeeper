const localhost = Deno.env.get("DENO_ENV") === "development" ? "localhost" : "host.docker.internal";
const config = {
	token: Deno.env.get("APP_TOKEN") ?? "IPFS-GATEKEEPER-TOKEN",
	whitelist: { api: Deno.env.get("WHITE_STATUS_API"), token: Deno.env.get("WHITE_STATUS_TOKEN") },
	docker: { host: localhost, port: 2375, version: "v1.46" },
	kuboContainerName: "ipfs_container",
	kuboHost: localhost,
};
export default config;
