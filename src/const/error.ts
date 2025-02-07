export interface Error {
	code: number;
	msg: string;
}
const errors = {
	UnknownError: {
		code: 1000,
		msg: "Unknown error",
	},
	ParamError: {
		code: 2000,
		msg: "Param error",
	},
	DockerError: {
		code: 3000,
		msg: "Docker error",
	},
	ContainerNotFound: {
		code: 4000,
		msg: "Container not found",
	},
	// 文件未授权
	FileNotAuthorized: {
		code: 5000,
		msg: "File not authorized",
	},
} as { [key: string]: Error };

export default errors;
