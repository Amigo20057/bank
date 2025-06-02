import { Injectable, OnModuleInit } from "@nestjs/common";
import { Client, ClientGrpc, Transport } from "@nestjs/microservices";
import { join } from "path";
import { firstValueFrom, Observable } from "rxjs";
import { CreateUserDto } from "./dto/create-user.dto";

interface UserServiceGrpc {
    createUser(data: CreateUserDto): Observable<any>;
    getUserByEmail(data: { email: string }): Observable<any>;
}

@Injectable()
export class UserClientService implements OnModuleInit {
    @Client({
        transport: Transport.GRPC,
        options: {
            package: "user",
            protoPath: join(process.cwd(), "src/proto/user.proto"),
            url: "localhost:50051",
        },
    })
    private client: ClientGrpc;

    private userService: UserServiceGrpc;

    onModuleInit() {
        this.userService =
            this.client.getService<UserServiceGrpc>("UserService");
        console.log("Connected to user-service via gRPC");
    }

    async createUser(data: CreateUserDto) {
        return firstValueFrom(this.userService.createUser(data));
    }

    async GetUserByEmail(email: string) {
        return firstValueFrom(this.userService.getUserByEmail({ email }));
    }
}
