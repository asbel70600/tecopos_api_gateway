export interface RegisterUserRequest {
    readonly email: string;
    readonly password: string;
}

export interface RegisterUserResponse {
    readonly id: number;
    readonly email: string;
}
