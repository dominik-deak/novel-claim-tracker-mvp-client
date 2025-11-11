import { MOCK_USERS } from "../../constants/auth";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
	const { currentUser, setCurrentUser } = useAuth();

	const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const userId = e.target.value;
		if (userId === "") {
			setCurrentUser(null);
		} else {
			setCurrentUser(MOCK_USERS[userId]);
		}
	};

	return (
		<header className="bg-blue-600 text-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 py-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">R&D Claim Tracker</h1>
						<p className="text-blue-100 text-sm mt-1">
							Manage R&D tax relief claims and projects
						</p>
					</div>
					<div className="flex items-center space-x-2">
						<label htmlFor="user-select" className="text-sm font-medium">
							User:
						</label>
						<select
							id="user-select"
							value={currentUser?.userId || ""}
							onChange={handleUserChange}
							className="px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
						>
							<option value="">Not logged in</option>
							<option value="user-1">Alice (Submitter)</option>
							<option value="user-2">Bob (Reviewer)</option>
						</select>
					</div>
				</div>
			</div>
		</header>
	);
}
