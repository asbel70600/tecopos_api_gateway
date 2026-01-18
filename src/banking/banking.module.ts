import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { join } from "node:path";
import { BankingController } from "./banking.controller";
import { BankingServiceGrpcAdapter } from "./banking.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        AuthModule, // For JwtAuthGuard
        ClientsModule.register([
            {
                name: "BANKING_SERVICE",
                transport: Transport.GRPC,
                options: {
                    package: "banking",
                    protoPath: join(__dirname, "../proto/banking.proto"),
                    url:
                        process.env["BANKING_SERVICE_URL"] || "localhost:50052",
                },
            },
        ]),
    ],
    controllers: [BankingController],
    providers: [BankingServiceGrpcAdapter],
    exports: [BankingServiceGrpcAdapter],
})
export class BankingModule {}
