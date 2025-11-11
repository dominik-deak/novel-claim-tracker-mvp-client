import { type ReactNode, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import type { User } from "../types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [currentUser, setCurrentUserState] = useState<User | null>(() => {
		const stored = localStorage.getItem("currentUser");
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				return null;
			}
		}
		return null;
	});

	const setCurrentUser = (user: User | null) => {
		setCurrentUserState(user);
		if (user) {
			localStorage.setItem("currentUser", JSON.stringify(user));
		} else {
			localStorage.removeItem("currentUser");
		}
	};

	const isSubmitter = currentUser?.role === "submitter";
	const isReviewer = currentUser?.role === "reviewer";

	return (
		<AuthContext.Provider
			value={{ currentUser, setCurrentUser, isSubmitter, isReviewer }}
		>
			{children}
		</AuthContext.Provider>
	);
}
