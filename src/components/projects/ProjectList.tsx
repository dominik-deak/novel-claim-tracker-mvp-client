import { useProjects } from "../../hooks/useProjects";
import ProjectCard from "./ProjectCard";

export default function ProjectList() {
	const { projects, loading, error } = useProjects();

	if (loading) {
		return <div className="text-center py-8">Loading projects...</div>;
	}
	if (error) {
		return <div className="text-red-600 py-8">Error: {error}</div>;
	}

	if (projects.length === 0) {
		return (
			<div className="text-center py-8 text-gray-500">
				No projects yet. Create one to get started!
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{projects.map((project) => (
				<ProjectCard key={project.projectId} project={project} />
			))}
		</div>
	);
}
