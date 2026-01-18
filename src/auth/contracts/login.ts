export interface LoginRequest {
    readonly email: string;
    readonly password: string;
}

export interface LoginResponse {
    readonly access_token: string;
    readonly token_type: string;
    readonly expires_in: number;
}
