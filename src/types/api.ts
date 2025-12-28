// src/types/api.ts

export interface AgentRequest {
    user_id: string;
    message: string;
    context: Record<string, any>; // Profile data, history, etc.
}

export interface AgentResponse {
    response: string;
    actions?: string[];
    data?: Record<string, any>; // Dynamic data like workout plans
}