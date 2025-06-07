import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>("PORT_APPLICATION");

    app.enableCors({
        origin: "http://185.25.117.206:3000",
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    app.use(cookieParser());

    console.log(`AUTH-SERVICE is running on port ${port}`);
    await app.listen(port);
}
bootstrap();
