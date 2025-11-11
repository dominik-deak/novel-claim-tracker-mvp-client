import { useProjects } from "../../hooks/useProjects";

interface ProjectSelectorProps {
	selectedIds: string[];
	onChange: (ids: string[]) => void;
}

export default function ProjectSelector({
	selectedIds,
	onChange,
}: ProjectSelectorProps) {
	const { projects, loading, error } = useProjects();

	const handleToggle = (projectId: string) => {
		if (selectedIds.includes(projectId)) {
			onChange(selectedIds.filter((id) => id !== projectId));
		} else {
			onChange([...selectedIds, projectId]);
		}
	};

	if (loading)
		return <div className="text-sm text-gray-500">Loading projects...</div>;
	if (error)
		return (
			<div className="text-sm text-red-500">
				Error loading projects: {error}
			</div>
		);

	if (projects.length === 0) {
		return (
			<div className="text-sm text-gray-500">
				No projects available. Create a project first.
			</div>
		);
	}

	return (
		<div>
			<label
				htmlFor="project-selector"
				className="block text-sm font-medium mb-2"
			>
				Link Projects (Optional)
			</label>
			<div
				id="project-selector"
				className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-3"
			>
				{projects.map((project) => (
					<label
						key={project.projectId}
						className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
					>
						<input
							type="checkbox"
							checked={selectedIds.includes(project.projectId)}
							onChange={() => handleToggle(project.projectId)}
							className="mt-1"
						/>
						<div className="flex-1">
							<div className="font-medium">{project.name}</div>
							<div className="text-sm text-gray-600">{project.description}</div>
						</div>
					</label>
				))}
			</div>
			<p className="text-sm text-gray-500 mt-1">
				Selected: {selectedIds.length} project
				{selectedIds.length !== 1 ? "s" : ""}
			</p>
		</div>
	);
}
