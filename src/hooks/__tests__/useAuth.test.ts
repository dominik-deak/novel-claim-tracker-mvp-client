import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MOCK_USERS } from "../../constants/auth";
import { AuthProvider } from "../../contexts/AuthContext";
import { useAuth } from "../useAuth";

describe("useAuth", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("should throw error when used outside AuthProvider", () => {
		expect(() => renderHook(() => useAuth())).toThrow(
			"useAuth must be used within an AuthProvider",
		);
	});

	it("should return null currentUser initially", () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		expect(result.current.currentUser).toBeNull();
		expect(result.current.isSubmitter).toBe(false);
		expect(result.current.isReviewer).toBe(false);
	});

	it("should set current user", () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-1"]);
		});

		expect(result.current.currentUser).toEqual({
			userId: "user-1",
			name: "Alice",
			role: "submitter",
		});
	});

	it("should identify submitter role correctly", () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-1"]);
		});

		expect(result.current.isSubmitter).toBe(true);
		expect(result.current.isReviewer).toBe(false);
	});

	it("should identify reviewer role correctly", () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-2"]);
		});

		expect(result.current.isSubmitter).toBe(false);
		expect(result.current.isReviewer).toBe(true);
	});

	it("should persist user to localStorage", () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-1"]);
		});

		const stored = localStorage.getItem("currentUser");
		expect(stored).not.toBeNull();
		expect(JSON.parse(stored as string)).toEqual(MOCK_USERS["user-1"]);
	});

	it("should clear user and localStorage when set to null", () => {
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

		expect(result.current.currentUser).toBeNull();
		expect(localStorage.getItem("currentUser")).toBeNull();
		expect(result.current.isSubmitter).toBe(false);
		expect(result.current.isReviewer).toBe(false);
	});

	it("should restore user from localStorage on mount", () => {
		localStorage.setItem("currentUser", JSON.stringify(MOCK_USERS["user-2"]));

		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		expect(result.current.currentUser).toEqual(MOCK_USERS["user-2"]);
		expect(result.current.isReviewer).toBe(true);
		expect(result.current.isSubmitter).toBe(false);
	});

	it("should handle corrupted localStorage data gracefully", () => {
		localStorage.setItem("currentUser", "invalid-json{");

		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		expect(result.current.currentUser).toBeNull();
		expect(result.current.isSubmitter).toBe(false);
		expect(result.current.isReviewer).toBe(false);
	});

	it("should switch between users", () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-1"]);
		});

		expect(result.current.currentUser?.name).toBe("Alice");
		expect(result.current.isSubmitter).toBe(true);

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-2"]);
		});

		expect(result.current.currentUser?.name).toBe("Bob");
		expect(result.current.isReviewer).toBe(true);
		expect(result.current.isSubmitter).toBe(false);
	});

	it("should update localStorage when switching users", () => {
		const { result } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-1"]);
		});

		expect(JSON.parse(localStorage.getItem("currentUser") as string).name).toBe(
			"Alice",
		);

		act(() => {
			result.current.setCurrentUser(MOCK_USERS["user-2"]);
		});

		expect(JSON.parse(localStorage.getItem("currentUser") as string).name).toBe(
			"Bob",
		);
	});

	it("should maintain user state across multiple consumers", () => {
		const { result: result1 } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		const { result: result2 } = renderHook(() => useAuth(), {
			wrapper: AuthProvider,
		});

		act(() => {
			result1.current.setCurrentUser(MOCK_USERS["user-1"]);
		});

		expect(result2.current.currentUser).toBeNull();
	});
});
