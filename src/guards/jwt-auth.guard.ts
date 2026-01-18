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
        try {
            const response = await firstValueFrom(
                from(this.authServiceGrpc.getPublicKey()),
            );
            this.publicKey = response.publicKey;
            console.log("Public key fetched successfully from SSO");
        } catch (error) {
            console.error("Failed to fetch public key from SSO:", error);
            throw error;
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("No token provided");
        }

        const token = authHeader.substring(7); // Remove 'Bearer '

        if (!this.publicKey) {
            throw new UnauthorizedException("Public key not available");
        }

        try {
            const decoded = jwt.verify(token, this.publicKey, {
                algorithms: ["RS256"],
            });

            // Attach decoded user info to request
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
}
