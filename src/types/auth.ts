export type UserRole = "submitter" | "reviewer";

export interface User {
	userId: string;
	name: string;
	role: UserRole;
}

export interface AuthContextType {
	currentUser: User | null;
	setCurrentUser: (user: User | null) => void;
	isSubmitter: boolean;
	isReviewer: boolean;
}
