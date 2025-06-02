import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import * as cookieParser from "cookie-parser";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.getOrThrow<number>("APPLICATION_PORT");

    app.use(cookieParser());

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: "user",
            protoPath: join(process.cwd(), "src/proto/user.proto"),
            url: "0.0.0.0:50051",
        },
    });
    await app.startAllMicroservices();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    await app.listen(port);
    console.log(`USER-SERVICE is running on port ${port}`);
}
bootstrap();
