import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            const message = `${error.message ?? ""}`.toLowerCase();
            const code = error.code ?? "";

            if (
                code === "ERR_BLOCKED_BY_CLIENT" ||
                code === "ERR_NETWORK" ||
                message.includes("network error") ||
                message.includes("blocked by client")
            ) {
                error.isBlockedOrNetwork = true;
            }
        }

        return Promise.reject(error);
    }
);

export default api;