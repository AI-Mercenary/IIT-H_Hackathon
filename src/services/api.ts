import { AgentRequest, AgentResponse } from '../types/api';

const API_BASE_URL = "http://localhost:8000/api";

const chatWithAgent = async (request: AgentRequest): Promise<AgentResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/today/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const api = {
    today: {
        chat: chatWithAgent
    }
};