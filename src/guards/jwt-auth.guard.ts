import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    OnModuleInit,
} from "@nestjs/common";
import { AuthServiceGrpcAdapter } from "../auth/auth.service";
import * as jwt from "jsonwebtoken";
import { firstValueFrom, from } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
    private publicKey: string | null = null;

    constructor(private readonly authServiceGrpc: AuthServiceGrpcAdapter) {}

    async onModuleInit() {
        await this.fetchPublicKeyWithRetry(5); // 5 retries
    }

    private async fetchPublicKeyWithRetry(
        maxRetries: number,
        currentRetry: number = 0,
    ): Promise<void> {
        try {
            const response = await firstValueFrom(
                from(this.authServiceGrpc.getPublicKey()),
            );
            this.publicKey = response.publicKey;
            console.log("Public key fetched successfully from SSO");
        } catch (error) {
            if (currentRetry >= maxRetries) {
                console.error(
                    `Failed to fetch public key after ${maxRetries} retries:`,
                    error,
                );
                throw new Error("Could not fetch public key from SSO");
            }

            // Exponential backoff: 1s, 2s, 4s, 8s, 16s
            const waitTime = Math.pow(2, currentRetry) * 1000;
            console.warn(
                `Failed to fetch public key (attempt ${currentRetry + 1}/${maxRetries}). ` +
                    `Retrying in ${waitTime / 1000}s...`,
            );

            await this.sleep(waitTime);
            return this.fetchPublicKeyWithRetry(maxRetries, currentRetry + 1);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("No token provided");
        }

        const token = authHeader.substring(7);

        if (!this.publicKey) {
            throw new UnauthorizedException("Public key not available");
        }

        try {
            const decoded = jwt.verify(token, this.publicKey, {
                algorithms: ["RS256"],
            });

            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
}
