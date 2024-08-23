// type StorageType = {
//     getItem: (key: string) => string | null;
//     setItem: (key: string, value: string) => void;
//     removeItem: (key: string) => void;
// };

const TokenService = (() => {
    // const setStorage = (newStorage: StorageType) => {
    // 	storage = newStorage;
    // };

    const getAccessToken = (): string | null => localStorage.getItem("access");
    const getRefreshToken = (): string | null =>
        localStorage.getItem("refresh");

    const setAccessToken = (token: string): void =>
        localStorage.setItem("access", token);
    const setRefreshToken = (token: string): void =>
        localStorage.setItem("refresh", token);

    const removeTokens = (): void => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    };

    return {
        getAccessToken,
        getRefreshToken,
        setAccessToken,
        setRefreshToken,
        removeTokens,
    };
})();

export default TokenService;
