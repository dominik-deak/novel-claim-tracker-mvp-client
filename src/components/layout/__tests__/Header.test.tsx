import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../../../contexts/AuthContext";
import Header from "../Header";

describe("Header", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("should render the header with title", () => {
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		expect(screen.getByText("R&D Claim Tracker")).toBeInTheDocument();
		expect(
			screen.getByText("Manage R&D tax relief claims and projects"),
		).toBeInTheDocument();
	});

	it("should render user selector dropdown", () => {
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", { name: /user/i });
		expect(select).toBeInTheDocument();
		expect(screen.getByText("Not logged in")).toBeInTheDocument();
		expect(screen.getByText("Alice (Submitter)")).toBeInTheDocument();
		expect(screen.getByText("Bob (Reviewer)")).toBeInTheDocument();
	});

	it("should start with 'Not logged in' selected", () => {
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", {
			name: /user/i,
		}) as HTMLSelectElement;
		expect(select.value).toBe("");
	});

	it("should update selection when user selects Alice", async () => {
		const user = userEvent.setup();
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", { name: /user/i });
		await user.selectOptions(select, "user-1");

		expect((select as HTMLSelectElement).value).toBe("user-1");
	});

	it("should update selection when user selects Bob", async () => {
		const user = userEvent.setup();
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", { name: /user/i });
		await user.selectOptions(select, "user-2");

		expect((select as HTMLSelectElement).value).toBe("user-2");
	});

	it("should store user in localStorage when selected", async () => {
		const user = userEvent.setup();
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", { name: /user/i });
		await user.selectOptions(select, "user-1");

		const stored = localStorage.getItem("currentUser");
		expect(stored).not.toBeNull();
		const parsedUser = JSON.parse(stored!);
		expect(parsedUser.userId).toBe("user-1");
		expect(parsedUser.name).toBe("Alice");
		expect(parsedUser.role).toBe("submitter");
	});

	it("should clear localStorage when user logs out", async () => {
		const user = userEvent.setup();
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", { name: /user/i });

		await user.selectOptions(select, "user-1");
		expect(localStorage.getItem("currentUser")).not.toBeNull();

		await user.selectOptions(select, "");
		expect(localStorage.getItem("currentUser")).toBeNull();
	});

	it("should restore user from localStorage on mount", () => {
		localStorage.setItem(
			"currentUser",
			JSON.stringify({
				userId: "user-2",
				name: "Bob",
				role: "reviewer",
			}),
		);

		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", {
			name: /user/i,
		}) as HTMLSelectElement;
		expect(select.value).toBe("user-2");
	});

	it("should handle corrupted localStorage data gracefully", () => {
		localStorage.setItem("currentUser", "invalid-json{");

		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", {
			name: /user/i,
		}) as HTMLSelectElement;
		expect(select.value).toBe("");
	});

	it("should switch between users", async () => {
		const user = userEvent.setup();
		render(
			<AuthProvider>
				<Header />
			</AuthProvider>,
		);

		const select = screen.getByRole("combobox", { name: /user/i });

		await user.selectOptions(select, "user-1");
		expect((select as HTMLSelectElement).value).toBe("user-1");

		await user.selectOptions(select, "user-2");
		expect((select as HTMLSelectElement).value).toBe("user-2");

		const stored = localStorage.getItem("currentUser");
		const parsedUser = JSON.parse(stored!);
		expect(parsedUser.name).toBe("Bob");
		expect(parsedUser.role).toBe("reviewer");
	});
});
