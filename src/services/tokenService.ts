type StorageType = {
	getItem: (key: string) => string | null;
	setItem: (key: string, value: string) => void;
	removeItem: (key: string) => void;
};

const TokenService = (() => {
	let storage: StorageType = localStorage;

	const setStorage = (newStorage: StorageType) => {
		storage = newStorage;
	};

	const getAccessToken = (): string | null => storage.getItem("accessToken");
	const getRefreshToken = (): string | null =>
		storage.getItem("refreshToken");

	const setAccessToken = (token: string): void =>
		storage.setItem("accessToken", token);
	const setRefreshToken = (token: string): void =>
		storage.setItem("refreshToken", token);

	const removeTokens = (): void => {
		storage.removeItem("accessToken");
		storage.removeItem("refreshToken");
	};

	return {
		getAccessToken,
		getRefreshToken,
		setAccessToken,
		setRefreshToken,
		removeTokens,
		setStorage,
	};
})();

export default TokenService;
