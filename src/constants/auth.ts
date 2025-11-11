import type { User } from "../types/auth";

export const MOCK_USERS: Record<string, User> = {
	"user-1": { userId: "user-1", name: "Alice", role: "submitter" },
	"user-2": { userId: "user-2", name: "Bob", role: "reviewer" },
};
