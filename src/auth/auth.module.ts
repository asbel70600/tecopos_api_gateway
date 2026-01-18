import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthServiceGrpcAdapter } from "./auth.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "node:path";

@Module({
    imports: [
        ClientsModule.register([
            {
                name: "SSO_SERVICE",
                transport: Transport.GRPC,
                options: {
                    package: "sso",
                    protoPath: join(__dirname, "../proto/sso.proto"),
                    url: process.env["SSO_SERVICE_URL"] || "localhost:50051",
                },
            },
        ]),
    ],
    exports: [AuthServiceGrpcAdapter],
    controllers: [AuthController],
    providers: [AuthServiceGrpcAdapter],
})
export class AuthModule {}
