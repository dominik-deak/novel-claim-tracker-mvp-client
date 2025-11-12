import axios, { type AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
} from "../../types";

vi.mock("axios");

describe("API Service", () => {
	const mockAxiosInstance = {
		get: vi.fn(),
		post: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
		interceptors: {
			request: {
				use: vi.fn(),
			},
		},
	};

	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();

		vi.mocked(axios.create).mockReturnValue(
			mockAxiosInstance as unknown as AxiosInstance,
		);
	});

	describe("Claims API", () => {
		let claimsApi: typeof import("../api").claimsApi;

		beforeEach(async () => {
			const apiModule = await import("../api");
			claimsApi = apiModule.claimsApi;
		});

		const mockClaim: Claim = {
			claimId: "claim-123",
			companyName: "Test Company",
			claimPeriod: { startDate: "2024-01-01", endDate: "2024-12-31" },
			amount: 50000,
			status: "Draft",
			userId: "user-1",
			submittedBy: null,
			reviewedBy: null,
			submittedAt: null,
			reviewedAt: null,
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: "2024-01-01T00:00:00.000Z",
		};

		const mockClaimWithProjects: ClaimWithProjects = {
			...mockClaim,
			projects: [],
		};

		describe("create", () => {
			it("should create a claim", async () => {
				const input: CreateClaimInput = {
					companyName: "Test Company",
					claimPeriod: { startDate: "2024-01-01", endDate: "2024-12-31" },
					amount: 50000,
				};

				mockAxiosInstance.post.mockResolvedValue({
					data: { claim: mockClaim },
				});

				const result = await claimsApi.create(input);

				expect(mockAxiosInstance.post).toHaveBeenCalledWith("/claims", input);
				expect(result).toEqual(mockClaim);
			});

			it("should create claim with project IDs", async () => {
				const input: CreateClaimInput = {
					companyName: "Test Company",
					claimPeriod: { startDate: "2024-01-01", endDate: "2024-12-31" },
					amount: 50000,
					projectIds: ["proj-1", "proj-2"],
				};

				mockAxiosInstance.post.mockResolvedValue({
					data: { claim: mockClaim },
				});

				const result = await claimsApi.create(input);

				expect(mockAxiosInstance.post).toHaveBeenCalledWith("/claims", input);
				expect(result).toEqual(mockClaim);
			});
		});

		describe("list", () => {
			it("should list all claims without filter", async () => {
				const claims = [mockClaimWithProjects];
				mockAxiosInstance.get.mockResolvedValue({
					data: { claims },
				});

				const result = await claimsApi.list();

				expect(mockAxiosInstance.get).toHaveBeenCalledWith("/claims", {
					params: { status: undefined },
				});
				expect(result).toEqual(claims);
			});

			it("should list claims with status filter", async () => {
				const claims = [mockClaimWithProjects];
				mockAxiosInstance.get.mockResolvedValue({
					data: { claims },
				});

				const result = await claimsApi.list("Draft");

				expect(mockAxiosInstance.get).toHaveBeenCalledWith("/claims", {
					params: { status: "Draft" },
				});
				expect(result).toEqual(claims);
			});

			it("should handle empty claims array", async () => {
				mockAxiosInstance.get.mockResolvedValue({
					data: { claims: [] },
				});

				const result = await claimsApi.list();

				expect(result).toEqual([]);
			});
		});

		describe("get", () => {
			it("should get a single claim by ID", async () => {
				mockAxiosInstance.get.mockResolvedValue({
					data: { claim: mockClaimWithProjects },
				});

				const result = await claimsApi.get("claim-123");

				expect(mockAxiosInstance.get).toHaveBeenCalledWith("/claims/claim-123");
				expect(result).toEqual(mockClaimWithProjects);
			});
		});

		describe("update", () => {
			it("should update a claim", async () => {
				const input: UpdateClaimInput = {
					status: "Submitted",
				};
				const updatedClaim = { ...mockClaim, status: "Submitted" as const };

				mockAxiosInstance.patch.mockResolvedValue({
					data: { claim: updatedClaim },
				});

				const result = await claimsApi.update("claim-123", input);

				expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
					"/claims/claim-123",
					input,
				);
				expect(result).toEqual(updatedClaim);
			});

			it("should update multiple claim fields", async () => {
				const input: UpdateClaimInput = {
					status: "Approved",
					companyName: "Updated Company",
					amount: 75000,
				};

				mockAxiosInstance.patch.mockResolvedValue({
					data: { claim: { ...mockClaim, ...input } },
				});

				const result = await claimsApi.update("claim-123", input);

				expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
					"/claims/claim-123",
					input,
				);
				expect(result.companyName).toBe("Updated Company");
			});
		});

		describe("delete", () => {
			it("should delete a claim", async () => {
				mockAxiosInstance.delete.mockResolvedValue({});

				await claimsApi.delete("claim-123");

				expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
					"/claims/claim-123",
				);
			});

			it("should return void", async () => {
				mockAxiosInstance.delete.mockResolvedValue({});

				const result = await claimsApi.delete("claim-123");

				expect(result).toBeUndefined();
			});
		});

		describe("linkProjects", () => {
			it("should link projects to a claim", async () => {
				const input: LinkProjectsInput = {
					projectIds: ["proj-1", "proj-2"],
				};

				mockAxiosInstance.post.mockResolvedValue({});

				await claimsApi.linkProjects("claim-123", input);

				expect(mockAxiosInstance.post).toHaveBeenCalledWith(
					"/claims/claim-123/projects",
					input,
				);
			});

			it("should return void", async () => {
				mockAxiosInstance.post.mockResolvedValue({});

				const result = await claimsApi.linkProjects("claim-123", {
					projectIds: ["proj-1"],
				});

				expect(result).toBeUndefined();
			});
		});

		describe("unlinkProject", () => {
			it("should unlink a project from a claim", async () => {
				mockAxiosInstance.delete.mockResolvedValue({});

				await claimsApi.unlinkProject("claim-123", "proj-456");

				expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
					"/claims/claim-123/projects/proj-456",
				);
			});

			it("should return void", async () => {
				mockAxiosInstance.delete.mockResolvedValue({});

				const result = await claimsApi.unlinkProject("claim-123", "proj-456");

				expect(result).toBeUndefined();
			});
		});
	});

	describe("Projects API", () => {
		let projectsApi: typeof import("../api").projectsApi;

		beforeEach(async () => {
			const apiModule = await import("../api");
			projectsApi = apiModule.projectsApi;
		});

		const mockProject: Project = {
			projectId: "proj-123",
			name: "Test Project",
			description: "A test project",
			userId: "user-1",
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: "2024-01-01T00:00:00.000Z",
		};

		const mockProjectWithClaims: ProjectWithClaims = {
			...mockProject,
			claims: [],
		};

		describe("create", () => {
			it("should create a project", async () => {
				const input: CreateProjectInput = {
					name: "Test Project",
					description: "A test project",
				};

				mockAxiosInstance.post.mockResolvedValue({
					data: { project: mockProject },
				});

				const result = await projectsApi.create(input);

				expect(mockAxiosInstance.post).toHaveBeenCalledWith("/projects", input);
				expect(result).toEqual(mockProject);
			});
		});

		describe("list", () => {
			it("should list all projects", async () => {
				const projects = [mockProject];
				mockAxiosInstance.get.mockResolvedValue({
					data: { projects },
				});

				const result = await projectsApi.list();

				expect(mockAxiosInstance.get).toHaveBeenCalledWith("/projects");
				expect(result).toEqual(projects);
			});

			it("should handle empty projects array", async () => {
				mockAxiosInstance.get.mockResolvedValue({
					data: { projects: [] },
				});

				const result = await projectsApi.list();

				expect(result).toEqual([]);
			});
		});

		describe("get", () => {
			it("should get a single project by ID", async () => {
				mockAxiosInstance.get.mockResolvedValue({
					data: { project: mockProjectWithClaims },
				});

				const result = await projectsApi.get("proj-123");

				expect(mockAxiosInstance.get).toHaveBeenCalledWith(
					"/projects/proj-123",
				);
				expect(result).toEqual(mockProjectWithClaims);
			});
		});

		describe("update", () => {
			it("should update a project", async () => {
				const input: UpdateProjectInput = {
					name: "Updated Project",
				};
				const updatedProject = { ...mockProject, name: "Updated Project" };

				mockAxiosInstance.patch.mockResolvedValue({
					data: { project: updatedProject },
				});

				const result = await projectsApi.update("proj-123", input);

				expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
					"/projects/proj-123",
					input,
				);
				expect(result).toEqual(updatedProject);
			});

			it("should update project description", async () => {
				const input: UpdateProjectInput = {
					description: "Updated description",
				};

				mockAxiosInstance.patch.mockResolvedValue({
					data: { project: { ...mockProject, ...input } },
				});

				const result = await projectsApi.update("proj-123", input);

				expect(result.description).toBe("Updated description");
			});

			it("should update both name and description", async () => {
				const input: UpdateProjectInput = {
					name: "New Name",
					description: "New Description",
				};

				mockAxiosInstance.patch.mockResolvedValue({
					data: { project: { ...mockProject, ...input } },
				});

				const result = await projectsApi.update("proj-123", input);

				expect(result.name).toBe("New Name");
				expect(result.description).toBe("New Description");
			});
		});

		describe("delete", () => {
			it("should delete a project", async () => {
				mockAxiosInstance.delete.mockResolvedValue({});

				await projectsApi.delete("proj-123");

				expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
					"/projects/proj-123",
				);
			});

			it("should return void", async () => {
				mockAxiosInstance.delete.mockResolvedValue({});

				const result = await projectsApi.delete("proj-123");

				expect(result).toBeUndefined();
			});
		});
	});
});
