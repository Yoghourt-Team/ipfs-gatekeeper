const config = {
	token: Deno.env.get("TOKEN") ?? "SwhD2F4TrHEaZePDKyPX",
	docker: { host: "127.0.0.1", port: 2375, version: "v1.46" },
	kuboContainerName: "ipfs_container",
};
export default config;
