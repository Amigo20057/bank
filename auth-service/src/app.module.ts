import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { RedisProvider } from "./redis/redis.provider";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
    ],
    controllers: [],
    providers: [RedisProvider],
    exports: [RedisProvider],
})
export class AppModule {}
