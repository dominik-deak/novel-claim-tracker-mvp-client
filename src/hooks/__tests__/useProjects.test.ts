import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "../../types";

vi.mock("../../services/api", () => ({
	projectsApi: {
		list: vi.fn(),
	},
}));

// Import after mocking
import { projectsApi } from "../../services/api";
import { useProjects } from "../useProjects";

const mockProjectsApi = vi.mocked(projectsApi);

describe("useProjects", () => {
	const mockProjects: Project[] = [
		{
			projectId: "proj-1",
			name: "AI Research Project",
			description: "Machine learning for product optimization",
			userId: "user-1",
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: "2024-01-01T00:00:00.000Z",
		},
		{
			projectId: "proj-2",
			name: "Cloud Infrastructure",
			description: "Serverless architecture implementation",
			userId: "user-2",
			createdAt: "2024-01-15T00:00:00.000Z",
			updatedAt: "2024-01-15T00:00:00.000Z",
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Initial Data Loading", () => {
		it("should set loading to true initially", () => {
			mockProjectsApi.list.mockImplementation(() => new Promise(() => {}));

			const { result } = renderHook(() => useProjects());

			expect(result.current.loading).toBe(true);
			expect(result.current.projects).toEqual([]);
			expect(result.current.error).toBeNull();
		});

		it("should fetch projects on mount", async () => {
			mockProjectsApi.list.mockResolvedValue(mockProjects);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockProjectsApi.list).toHaveBeenCalledTimes(1);
			expect(result.current.projects).toEqual(mockProjects);
			expect(result.current.error).toBeNull();
		});

		it("should update projects state with fetched data", async () => {
			mockProjectsApi.list.mockResolvedValue(mockProjects);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.projects).toEqual(mockProjects);
			});

			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it("should handle empty projects array", async () => {
			mockProjectsApi.list.mockResolvedValue([]);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.projects).toEqual([]);
			expect(result.current.error).toBeNull();
		});

		it("should set loading to false after fetch completes", async () => {
			mockProjectsApi.list.mockResolvedValue(mockProjects);

			const { result } = renderHook(() => useProjects());

			// Initially loading
			expect(result.current.loading).toBe(true);

			// Eventually not loading
			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.projects).toEqual(mockProjects);
		});
	});

	describe("Error Handling", () => {
		it("should set error message when API call fails with Error", async () => {
			const errorMessage = "Failed to fetch projects";
			mockProjectsApi.list.mockRejectedValue(new Error(errorMessage));

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe(errorMessage);
			expect(result.current.projects).toEqual([]);
		});

		it("should use fallback message for string errors", async () => {
			mockProjectsApi.list.mockRejectedValue("String error");

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load projects");
			expect(result.current.projects).toEqual([]);
		});

		it("should use fallback message for null rejection", async () => {
			mockProjectsApi.list.mockRejectedValue(null);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load projects");
		});

		it("should use fallback message for undefined rejection", async () => {
			mockProjectsApi.list.mockRejectedValue(undefined);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load projects");
		});

		it("should use fallback message for object rejection", async () => {
			mockProjectsApi.list.mockRejectedValue({ code: 500, message: "Error" });

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load projects");
		});

		it("should clear error on successful refetch after error", async () => {
			mockProjectsApi.list.mockRejectedValueOnce(new Error("Network error"));
			mockProjectsApi.list.mockResolvedValueOnce(mockProjects);

			const { result } = renderHook(() => useProjects());

			// Wait for initial error
			await waitFor(() => {
				expect(result.current.error).toBe("Network error");
			});

			expect(result.current.projects).toEqual([]);

			// Refresh
			result.current.refresh();

			// Wait for successful refetch
			await waitFor(() => {
				expect(result.current.error).toBeNull();
			});

			expect(result.current.projects).toEqual(mockProjects);
			expect(result.current.loading).toBe(false);
		});

		it("should set loading to false even when errors occur", async () => {
			mockProjectsApi.list.mockRejectedValue(new Error("Error"));

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).not.toBeNull();
		});
	});

	describe("Refresh Functionality", () => {
		it("should refetch data when refresh is called", async () => {
			mockProjectsApi.list.mockResolvedValue(mockProjects);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockProjectsApi.list).toHaveBeenCalledTimes(1);

			// Call refresh
			result.current.refresh();

			await waitFor(() => {
				expect(mockProjectsApi.list).toHaveBeenCalledTimes(2);
			});

			expect(result.current.projects).toEqual(mockProjects);
		});

		it("should go through full loading cycle on refresh", async () => {
			mockProjectsApi.list.mockImplementation(
				() =>
					new Promise((resolve) => {
						setTimeout(() => resolve(mockProjects), 100);
					}),
			);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// Call refresh
			result.current.refresh();

			// Should immediately set loading to true
			await waitFor(() => {
				expect(result.current.loading).toBe(true);
			});

			// Should eventually set loading to false
			await waitFor(
				() => {
					expect(result.current.loading).toBe(false);
				},
				{ timeout: 200 },
			);

			expect(result.current.projects).toEqual(mockProjects);
		});

		it("should handle multiple rapid refresh calls", async () => {
			mockProjectsApi.list.mockResolvedValue(mockProjects);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// Call refresh multiple times rapidly
			result.current.refresh();
			result.current.refresh();
			result.current.refresh();

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			// Should have called API multiple times (initial + 3 refreshes)
			expect(mockProjectsApi.list.mock.calls.length).toBeGreaterThanOrEqual(2);
			expect(result.current.projects).toEqual(mockProjects);
		});

		it("should update projects with new data on refresh", async () => {
			const initialProjects = [mockProjects[0]];
			const updatedProjects = mockProjects;

			mockProjectsApi.list.mockResolvedValueOnce(initialProjects);
			mockProjectsApi.list.mockResolvedValueOnce(updatedProjects);

			const { result } = renderHook(() => useProjects());

			await waitFor(() => {
				expect(result.current.projects).toEqual(initialProjects);
			});

			// Refresh to get updated data
			result.current.refresh();

			await waitFor(() => {
				expect(result.current.projects).toEqual(updatedProjects);
			});

			expect(result.current.loading).toBe(false);
		});
	});
});
