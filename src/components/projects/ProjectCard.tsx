import type { Project } from "../../types";

interface ProjectCardProps {
	project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
	return (
		<div className="border rounded-lg p-4 bg-white shadow-sm">
			<h3 className="text-lg font-semibold mb-2">{project.name}</h3>
			<p className="text-gray-600 mb-3">{project.description}</p>
			<div className="text-sm text-gray-500">
				<p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
			</div>
		</div>
	);
}
