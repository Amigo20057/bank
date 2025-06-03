import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>("PORT_APPLICATION");

    app.enableCors({
        credentials: true,
        origin: "http://localhost:5173",
    });

    app.use(cookieParser());

    await app.listen(port);
    console.log(`API GATEWAY running on port ${port}`);
}

bootstrap();
