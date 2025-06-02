import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisProvider } from "./redis/redis.provider";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UserModule,
        PrismaModule,
    ],
    controllers: [],
    providers: [RedisProvider],
    exports: [RedisProvider],
})
export class AppModule {}
