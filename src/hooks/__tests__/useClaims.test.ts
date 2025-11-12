import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ClaimWithProjects } from "../../types";

vi.mock("../../services/api", () => ({
	claimsApi: {
		list: vi.fn(),
	},
}));

// Import after mocking
import { claimsApi } from "../../services/api";
import { useClaims } from "../useClaims";

const mockClaimsApi = vi.mocked(claimsApi);

describe("useClaims", () => {
	const mockClaims: ClaimWithProjects[] = [
		{
			claimId: "claim-1",
			companyName: "Test Company A",
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
			projects: [],
		},
		{
			claimId: "claim-2",
			companyName: "Test Company B",
			claimPeriod: { startDate: "2024-01-01", endDate: "2024-12-31" },
			amount: 75000,
			status: "Submitted",
			userId: "user-1",
			submittedBy: "user-1",
			reviewedBy: null,
			submittedAt: "2024-02-01T00:00:00.000Z",
			reviewedAt: null,
			createdAt: "2024-01-01T00:00:00.000Z",
			updatedAt: "2024-02-01T00:00:00.000Z",
			projects: [],
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("Initial Data Loading", () => {
		it("should set loading to true initially", () => {
			mockClaimsApi.list.mockImplementation(
				() =>
					new Promise(() => {
						// Promise never resolves - testing loading state
					}),
			);

			const { result } = renderHook(() => useClaims());

			expect(result.current.loading).toBe(true);
			expect(result.current.claims).toEqual([]);
			expect(result.current.error).toBeNull();
		});

		it("should fetch claims on mount", async () => {
			mockClaimsApi.list.mockResolvedValue(mockClaims);

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockClaimsApi.list).toHaveBeenCalledTimes(1);
			expect(mockClaimsApi.list).toHaveBeenCalledWith(undefined);
			expect(result.current.claims).toEqual(mockClaims);
			expect(result.current.error).toBeNull();
		});

		it("should update claims state with fetched data", async () => {
			mockClaimsApi.list.mockResolvedValue(mockClaims);

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.claims).toEqual(mockClaims);
			});

			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it("should handle empty claims array", async () => {
			mockClaimsApi.list.mockResolvedValue([]);

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.claims).toEqual([]);
			expect(result.current.error).toBeNull();
		});
	});

	describe("Status Filtering", () => {
		it("should pass statusFilter to API call", async () => {
			mockClaimsApi.list.mockResolvedValue([mockClaims[0]]);

			const { result } = renderHook(() => useClaims("Draft"));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockClaimsApi.list).toHaveBeenCalledWith("Draft");
			expect(result.current.claims).toEqual([mockClaims[0]]);
		});

		it("should refetch when statusFilter changes", async () => {
			mockClaimsApi.list
				.mockResolvedValueOnce(mockClaims)
				.mockResolvedValueOnce([mockClaims[1]]);

			const { result, rerender } = renderHook(
				({ status }) => useClaims(status),
				{
					initialProps: { status: undefined as string | undefined },
				},
			);

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockClaimsApi.list).toHaveBeenCalledTimes(1);
			expect(mockClaimsApi.list).toHaveBeenCalledWith(undefined);

			// Change filter
			rerender({ status: "Submitted" });

			await waitFor(() => {
				expect(mockClaimsApi.list).toHaveBeenCalledTimes(2);
			});

			expect(mockClaimsApi.list).toHaveBeenCalledWith("Submitted");

			await waitFor(() => {
				expect(result.current.claims).toEqual([mockClaims[1]]);
			});
		});

		it("should handle different status values", async () => {
			mockClaimsApi.list.mockResolvedValue(mockClaims);

			const { result: result1 } = renderHook(() => useClaims("Draft"));
			await waitFor(() => expect(result1.current.loading).toBe(false));
			expect(mockClaimsApi.list).toHaveBeenCalledWith("Draft");

			const { result: result2 } = renderHook(() => useClaims("Submitted"));
			await waitFor(() => expect(result2.current.loading).toBe(false));
			expect(mockClaimsApi.list).toHaveBeenCalledWith("Submitted");

			const { result: result3 } = renderHook(() => useClaims("Approved"));
			await waitFor(() => expect(result3.current.loading).toBe(false));
			expect(mockClaimsApi.list).toHaveBeenCalledWith("Approved");
		});
	});

	describe("Error Handling", () => {
		it("should set error message when API call fails with Error", async () => {
			const errorMessage = "Network error occurred";
			mockClaimsApi.list.mockRejectedValue(new Error(errorMessage));

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe(errorMessage);
			expect(result.current.claims).toEqual([]);
		});

		it("should use fallback message for non-Error failures", async () => {
			mockClaimsApi.list.mockRejectedValue("String error");

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load claims");
			expect(result.current.claims).toEqual([]);
		});

		it("should handle null rejection", async () => {
			mockClaimsApi.list.mockRejectedValue(null);

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load claims");
		});

		it("should handle undefined rejection", async () => {
			mockClaimsApi.list.mockRejectedValue(undefined);

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(result.current.error).toBe("Failed to load claims");
		});

		it("should clear error on successful refetch after error", async () => {
			mockClaimsApi.list.mockRejectedValueOnce(new Error("First error"));
			mockClaimsApi.list.mockResolvedValueOnce(mockClaims);

			const { result } = renderHook(() => useClaims());

			// Wait for initial error
			await waitFor(() => {
				expect(result.current.error).toBe("First error");
			});

			// Refresh
			result.current.refresh();

			// Wait for successful refetch
			await waitFor(() => {
				expect(result.current.error).toBeNull();
			});

			expect(result.current.claims).toEqual(mockClaims);
		});
	});

	describe("Refresh Functionality", () => {
		it("should refetch data when refresh is called", async () => {
			mockClaimsApi.list.mockResolvedValue(mockClaims);

			const { result } = renderHook(() => useClaims());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			expect(mockClaimsApi.list).toHaveBeenCalledTimes(1);

			// Call refresh
			result.current.refresh();

			await waitFor(() => {
				expect(mockClaimsApi.list).toHaveBeenCalledTimes(2);
			});

			expect(result.current.claims).toEqual(mockClaims);
		});

		it("should go through full loading cycle on refresh", async () => {
			mockClaimsApi.list.mockImplementation(
				() =>
					new Promise((resolve) => {
						setTimeout(() => resolve(mockClaims), 100);
					}),
			);

			const { result } = renderHook(() => useClaims());

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
		});

		it("should handle multiple rapid refresh calls", async () => {
			mockClaimsApi.list.mockResolvedValue(mockClaims);

			const { result } = renderHook(() => useClaims());

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
			expect(mockClaimsApi.list.mock.calls.length).toBeGreaterThanOrEqual(2);
			expect(result.current.claims).toEqual(mockClaims);
		});
	});
});
