import axios from "axios";
import type {
	Claim,
	ClaimWithProjects,
	CreateClaimInput,
	CreateProjectInput,
	LinkProjectsInput,
	Project,
	ProjectWithClaims,
	UpdateClaimInput,
	UpdateProjectInput,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const claimsApi = {
	create: async (data: CreateClaimInput): Promise<Claim> => {
		const response = await api.post("/claims", data);
		return response.data.claim;
	},

	list: async (status?: string): Promise<ClaimWithProjects[]> => {
		const response = await api.get("/claims", { params: { status } });
		return response.data.claims;
	},

	get: async (id: string): Promise<ClaimWithProjects> => {
		const response = await api.get(`/claims/${id}`);
		return response.data.claim;
	},

	update: async (id: string, data: UpdateClaimInput): Promise<Claim> => {
		const response = await api.patch(`/claims/${id}`, data);
		return response.data.claim;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/claims/${id}`);
	},

	linkProjects: async (
		id: string,
		data: LinkProjectsInput,
	): Promise<void> => {
		await api.post(`/claims/${id}/projects`, data);
	},

	unlinkProject: async (claimId: string, projectId: string): Promise<void> => {
		await api.delete(`/claims/${claimId}/projects/${projectId}`);
	},
};

export const projectsApi = {
	create: async (data: CreateProjectInput): Promise<Project> => {
		const response = await api.post("/projects", data);
		return response.data.project;
	},

	list: async (): Promise<Project[]> => {
		const response = await api.get("/projects");
		return response.data.projects;
	},

	get: async (id: string): Promise<ProjectWithClaims> => {
		const response = await api.get(`/projects/${id}`);
		return response.data.project;
	},

	update: async (id: string, data: UpdateProjectInput): Promise<Project> => {
		const response = await api.patch(`/projects/${id}`, data);
		return response.data.project;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(`/projects/${id}`);
	},
};
