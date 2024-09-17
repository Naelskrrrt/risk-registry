import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosError,
    AxiosRequestHeaders,
    InternalAxiosRequestConfig,
} from "axios";
import TokenService from "./tokenService";
import authService from "./authService";

const instance: AxiosInstance = axios.create();

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = TokenService.getAccessToken();
        if (token) {
            // Ajoutez le token d'authentification aux en-têtes de la requête
            config.headers = {
                ...(config.headers || {}), // Assurez-vous que config.headers n'est pas undefined
                Authorization: `Bearer ${token}`,
            } as AxiosRequestHeaders;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<AxiosResponse | Promise<AxiosError>> => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await authService.refreshAccessToken();
                TokenService.setAccessToken(newToken?.access as string);
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${newToken?.access}`;
                return instance(originalRequest);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (refreshError) {
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
