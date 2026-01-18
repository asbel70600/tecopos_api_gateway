import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { BankingModule } from "./banking/banking.module";

@Module({
    imports: [AuthModule, BankingModule],
})
export class AppModule {}
