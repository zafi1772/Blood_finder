import { createClientPool, SocketTimeoutError } from "redis";

const redisClient = createClientPool({
    url: process.env.REDIS_URL,
    socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries, cause) => {
            if (cause instanceof SocketTimeoutError) {
                return false;
            }

            const jitter = Math.floor(Math.random() * 200);
            const delay = Math.min(Math.pow(2, retries) * 50, 2000);

            return delay + jitter;
        },
        keepAlive: true,
    },
});

export default redisClient;
