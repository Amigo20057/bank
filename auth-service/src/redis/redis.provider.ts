import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

export const RedisProvider: Provider = {
    provide: "REDIS_CLIENT",
    useFactory: async (config: ConfigService) => {
        const redisHost = config.get<string>("REDIS_HOST");
        const redisPort = config.get<number>("REDIS_PORT");
        const redisUser = config.get<string>("REDIS_USER");
        const redisPassword = config.get<string>("REDIS_PASSWORD");

        console.log(`Redis Host: ${redisHost}`);
        console.log(`Redis Port: ${redisPort}`);

        return new Redis({
            host: redisHost,
            port: redisPort,
            username: redisUser,
            password: redisPassword,
        });
    },
    inject: [ConfigService],
};
