export interface Operation {
    readonly id: number;
    readonly accountId: number;
    readonly date: string;
    readonly type: string;
    readonly amount: number;
    readonly description: string;
    readonly createdAt: string;
}

export interface GetOperationsRequest {
    readonly accountId: number;
    readonly userId: number;
    readonly startDate?: string;
    readonly endDate?: string;
    readonly operationType?: string;
}

export interface GetOperationsResponse {
    readonly operations: Operation[];
}

export interface CreateOperationRequest {
    readonly accountId: number;
    readonly userId: number;
    readonly type: string;
    readonly amount: number;
    readonly description: string;
}

export interface CreateOperationResponse {
    readonly operation: Operation;
}
