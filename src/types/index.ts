export type ClaimStatus = "Draft" | "Submitted" | "Approved";

export interface ClaimPeriod {
	startDate: string;
	endDate: string;
}

export interface Claim {
	claimId: string;
	companyName: string;
	claimPeriod: ClaimPeriod;
	amount: number;
	status: ClaimStatus;
	userId: string | null;
	submittedBy: string | null;
	reviewedBy: string | null;
	submittedAt: string | null;
	reviewedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface Project {
	projectId: string;
	name: string;
	description: string;
	userId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ClaimWithProjects extends Claim {
	projects: Project[];
}

export interface ProjectWithClaims extends Project {
	claims: Claim[];
}

export interface CreateClaimInput {
	companyName: string;
	claimPeriod: ClaimPeriod;
	amount: number;
	projectIds?: string[];
}

export interface UpdateClaimInput {
	status?: ClaimStatus;
	companyName?: string;
	claimPeriod?: ClaimPeriod;
	amount?: number;
}

export interface CreateProjectInput {
	name: string;
	description: string;
}

export interface UpdateProjectInput {
	name?: string;
	description?: string;
}

export interface LinkProjectsInput {
	projectIds: string[];
}
