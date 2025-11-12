import { useState } from "react";
import toast from "react-hot-toast";
import { claimsApi } from "../../services/api";
import type { Project } from "../../types";
import { getErrorMessage } from "../../utils/errorHandler";
import ProjectSelector from "../projects/ProjectSelector";

interface ClaimProjectManagerProps {
	claimId: string;
	projects: Project[];
	onUpdate: () => void;
}

export default function ClaimProjectManager({
	claimId,
	projects,
	onUpdate,
}: ClaimProjectManagerProps) {
	const [managingProjects, setManagingProjects] = useState(false);
	const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
	const [linkingProjects, setLinkingProjects] = useState(false);
	const [unlinkingProjectId, setUnlinkingProjectId] = useState<string | null>(
		null,
	);

	const handleLinkProjects = async () => {
		if (selectedProjectIds.length === 0) return;

		try {
			setLinkingProjects(true);
			await claimsApi.linkProjects(claimId, {
				projectIds: selectedProjectIds,
			});
			toast.success("Projects linked successfully");
			setSelectedProjectIds([]);
			setManagingProjects(false);
			onUpdate();
		} catch (err: unknown) {
			const message = getErrorMessage(err);
			toast.error(message);
		} finally {
			setLinkingProjects(false);
		}
	};

	const handleUnlinkProject = async (projectId: string) => {
		try {
			setUnlinkingProjectId(projectId);
			await claimsApi.unlinkProject(claimId, projectId);
			toast.success("Project unlinked successfully");
			onUpdate();
		} catch (err: unknown) {
			const message = getErrorMessage(err);
			toast.error(message);
		} finally {
			setUnlinkingProjectId(null);
		}
	};

	return (
		<div className="mb-4">
			<div className="flex justify-between items-center mb-2">
				<p className="text-sm font-medium text-gray-700">
					Linked Projects {projects.length > 0 && `(${projects.length})`}
				</p>
				<button
					type="button"
					onClick={() => setManagingProjects(!managingProjects)}
					className="text-sm text-blue-600 hover:text-blue-800 font-medium"
				>
					{managingProjects ? "Cancel" : "Manage Projects"}
				</button>
			</div>

			{projects.length > 0 ? (
				<div className="space-y-1">
					{projects.map((project) => (
						<div
							key={project.projectId}
							className="flex justify-between items-start text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
						>
							<div className="flex-1">
								<span className="font-medium">{project.name}</span>
								<span className="text-gray-500"> - {project.description}</span>
							</div>
							<button
								type="button"
								onClick={() => handleUnlinkProject(project.projectId)}
								disabled={unlinkingProjectId === project.projectId}
								className="ml-2 text-red-600 hover:text-red-800 font-bold disabled:opacity-50"
								title="Remove project"
							>
								x
							</button>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-gray-500 italic">No projects linked yet</p>
			)}

			{managingProjects && (
				<div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
					<h4 className="text-sm font-medium mb-3">Add Projects to Claim</h4>
					<ProjectSelector
						selectedIds={selectedProjectIds}
						onChange={setSelectedProjectIds}
						excludeIds={projects.map((p) => p.projectId)}
					/>
					<button
						type="button"
						onClick={handleLinkProjects}
						disabled={linkingProjects || selectedProjectIds.length === 0}
						className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
					>
						{linkingProjects ? "Linking..." : "Link Selected Projects"}
					</button>
				</div>
			)}
		</div>
	);
}
