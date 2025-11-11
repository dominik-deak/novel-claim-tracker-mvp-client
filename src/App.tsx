import {
	BrowserRouter,
	Link,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";
import ClaimForm from "./components/claims/ClaimForm";
import ClaimList from "./components/claims/ClaimList";
import Header from "./components/layout/Header";
import ProjectForm from "./components/projects/ProjectForm";
import ProjectList from "./components/projects/ProjectList";

export default function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-gray-50">
				<Header />

				<nav className="bg-white shadow-sm mb-6">
					<div className="max-w-7xl mx-auto px-4">
						<div className="flex space-x-8 py-4">
							<Link
								to="/"
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								Claims
							</Link>
							<Link
								to="/claims/new"
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								New Claim
							</Link>
							<Link
								to="/projects"
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								Projects
							</Link>
							<Link
								to="/projects/new"
								className="text-blue-600 hover:text-blue-800 font-medium"
							>
								New Project
							</Link>
						</div>
					</div>
				</nav>

				<main className="max-w-7xl mx-auto px-4 py-6">
					<Routes>
						<Route path="/" element={<ClaimList />} />
						<Route path="/claims/new" element={<ClaimFormPage />} />
						<Route path="/projects" element={<ProjectList />} />
						<Route path="/projects/new" element={<ProjectFormPage />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

function ClaimFormPage() {
	const navigate = useNavigate();
	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Create New Claim</h1>
			<ClaimForm onSuccess={() => navigate("/")} />
		</div>
	);
}

function ProjectFormPage() {
	const navigate = useNavigate();
	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Create New Project</h1>
			<ProjectForm onSuccess={() => navigate("/projects")} />
		</div>
	);
}
