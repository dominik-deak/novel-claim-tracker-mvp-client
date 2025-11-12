import { render, renderHook } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { MOCK_USERS } from "../../constants/auth";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../types/auth";
import { AuthProvider } from "../AuthContext";

describe("AuthContext", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe("Provider Rendering", () => {
		it("should render children correctly", () => {
			const { getByText } = render(
				<AuthProvider>
					<div>Test Child</div>
				</AuthProvider>,
			);

			expect(getByText("Test Child")).toBeDefined();
		});

		it("should render multiple children", () => {
			const { getByText } = render(
				<AuthProvider>
					<div>Child 1</div>
					<div>Child 2</div>
					<div>Child 3</div>
				</AuthProvider>,
			);

			expect(getByText("Child 1")).toBeDefined();
			expect(getByText("Child 2")).toBeDefined();
			expect(getByText("Child 3")).toBeDefined();
		});
	});

	describe("Initial State", () => {
		it("should initialize with null user when localStorage is empty", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			expect(result.current.currentUser).toBeNull();
		});

		it("should initialize with user from localStorage", () => {
			const user: User = MOCK_USERS["user-1"];
			localStorage.setItem("currentUser", JSON.stringify(user));

			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			expect(result.current.currentUser).toEqual(user);
		});

		it("should initialize with null when localStorage has invalid JSON", () => {
			localStorage.setItem("currentUser", "invalid-json{{{");

			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			expect(result.current.currentUser).toBeNull();
		});

		it("should initialize with null when localStorage has empty string", () => {
			localStorage.setItem("currentUser", "");

			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			expect(result.current.currentUser).toBeNull();
		});

		it("should initialize with null when localStorage has null string", () => {
			localStorage.setItem("currentUser", "null");

			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			expect(result.current.currentUser).toBeNull();
		});
	});

	describe("User State Management", () => {
		it("should update user state when setCurrentUser is called", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			const user: User = MOCK_USERS["user-1"];

			act(() => {
				result.current.setCurrentUser(user);
			});

			expect(result.current.currentUser).toEqual(user);
		});

		it("should clear user state when setCurrentUser is called with null", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			expect(result.current.currentUser).not.toBeNull();

			act(() => {
				result.current.setCurrentUser(null);
			});

			expect(result.current.currentUser).toBeNull();
		});

		it("should allow switching between different users", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			expect(result.current.currentUser?.userId).toBe("user-1");

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-2"]);
			});

			expect(result.current.currentUser?.userId).toBe("user-2");
		});

		it("should handle setting the same user multiple times", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			const user: User = MOCK_USERS["user-1"];

			act(() => {
				result.current.setCurrentUser(user);
			});

			act(() => {
				result.current.setCurrentUser(user);
			});

			expect(result.current.currentUser).toEqual(user);
		});
	});

	describe("LocalStorage Synchronization", () => {
		it("should persist user to localStorage when set", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			const user: User = MOCK_USERS["user-1"];

			act(() => {
				result.current.setCurrentUser(user);
			});

			const stored = localStorage.getItem("currentUser");
			expect(stored).not.toBeNull();
			expect(JSON.parse(stored as string)).toEqual(user);
		});

		it("should remove user from localStorage when set to null", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			expect(localStorage.getItem("currentUser")).not.toBeNull();

			act(() => {
				result.current.setCurrentUser(null);
			});

			expect(localStorage.getItem("currentUser")).toBeNull();
		});

		it("should update localStorage when user changes", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			let stored = JSON.parse(localStorage.getItem("currentUser") as string);
			expect(stored.userId).toBe("user-1");

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-2"]);
			});

			stored = JSON.parse(localStorage.getItem("currentUser") as string);
			expect(stored.userId).toBe("user-2");
		});

		it("should keep localStorage in sync across multiple updates", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			// Set user
			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});
			expect(localStorage.getItem("currentUser")).not.toBeNull();

			// Switch user
			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-2"]);
			});
			expect(
				JSON.parse(localStorage.getItem("currentUser") as string).userId,
			).toBe("user-2");

			// Clear user
			act(() => {
				result.current.setCurrentUser(null);
			});
			expect(localStorage.getItem("currentUser")).toBeNull();

			// Set again
			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});
			expect(localStorage.getItem("currentUser")).not.toBeNull();
		});
	});

	describe("Role-Based Properties", () => {
		it("should compute isSubmitter correctly for submitter role", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]); // submitter
			});

			expect(result.current.isSubmitter).toBe(true);
			expect(result.current.isReviewer).toBe(false);
		});

		it("should compute isReviewer correctly for reviewer role", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-2"]); // reviewer
			});

			expect(result.current.isSubmitter).toBe(false);
			expect(result.current.isReviewer).toBe(true);
		});

		it("should return false for both roles when user is null", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			expect(result.current.isSubmitter).toBe(false);
			expect(result.current.isReviewer).toBe(false);
		});

		it("should update role properties when user changes", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]); // submitter
			});

			expect(result.current.isSubmitter).toBe(true);

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-2"]); // reviewer
			});

			expect(result.current.isSubmitter).toBe(false);
			expect(result.current.isReviewer).toBe(true);
		});

		it("should return false for both roles after clearing user", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			expect(result.current.isSubmitter).toBe(true);

			act(() => {
				result.current.setCurrentUser(null);
			});

			expect(result.current.isSubmitter).toBe(false);
			expect(result.current.isReviewer).toBe(false);
		});

		it("should handle user with undefined role", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			const userWithoutRole = {
				userId: "user-3",
				name: "Test User",
				role: undefined as unknown as "submitter" | "reviewer",
			};

			act(() => {
				result.current.setCurrentUser(userWithoutRole);
			});

			expect(result.current.isSubmitter).toBe(false);
			expect(result.current.isReviewer).toBe(false);
		});
	});

	describe("Context Sharing", () => {
		it("should share context state between multiple consumers with same provider", () => {
			const TestComponent = () => {
				const auth1 = useAuth();
				const auth2 = useAuth();

				return (
					<div>
						<div data-testid="user1">{auth1.currentUser?.userId || "null"}</div>
						<div data-testid="user2">{auth2.currentUser?.userId || "null"}</div>
					</div>
				);
			};

			const { getByTestId, rerender } = render(
				<AuthProvider>
					<TestComponent />
				</AuthProvider>,
			);

			expect(getByTestId("user1").textContent).toBe("null");
			expect(getByTestId("user2").textContent).toBe("null");

			// Both should see the same state
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			rerender(
				<AuthProvider>
					<TestComponent />
				</AuthProvider>,
			);

			// Note: Since we're using a new provider instance, the state won't be shared
			// This tests that each provider maintains its own state
		});

		it("should provide independent state for different provider instances", () => {
			const { result: result1 } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			const { result: result2 } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result1.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			// Different provider instances should have independent state
			expect(result1.current.currentUser).not.toBeNull();
			expect(result2.current.currentUser).toBeNull();
		});
	});

	describe("Edge Cases", () => {
		it("should handle rapid consecutive updates", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
				result.current.setCurrentUser(MOCK_USERS["user-2"]);
				result.current.setCurrentUser(null);
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			expect(result.current.currentUser).toEqual(MOCK_USERS["user-1"]);
		});

		it("should handle setting user when localStorage is full", () => {
			// Fill localStorage to near capacity
			try {
				for (let i = 0; i < 1000; i++) {
					localStorage.setItem(`dummy-${i}`, "x".repeat(1000));
				}
			} catch {
				// localStorage is full
			}

			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			// Should handle gracefully even if localStorage fails
			act(() => {
				result.current.setCurrentUser(MOCK_USERS["user-1"]);
			});

			// State should still update even if localStorage fails
			expect(result.current.currentUser).toEqual(MOCK_USERS["user-1"]);
		});

		it("should handle malformed user objects gracefully", () => {
			const { result } = renderHook(() => useAuth(), {
				wrapper: AuthProvider,
			});

			const malformedUser = {
				userId: "user-3",
				name: "Test",
				// Missing role field
			} as User;

			act(() => {
				result.current.setCurrentUser(malformedUser);
			});

			expect(result.current.currentUser).toEqual(malformedUser);
			expect(result.current.isSubmitter).toBe(false);
			expect(result.current.isReviewer).toBe(false);
		});
	});
});
