import { useState } from "react";
import toast from "react-hot-toast";
import { claimsApi } from "../../services/api";
import type { ClaimStatus, ClaimWithProjects } from "../../types";
import { getErrorMessage } from "../../utils/errorHandler";
import ProjectSelector from "../projects/ProjectSelector";
import StatusBadge from "./StatusBadge";

interface ClaimCardProps {
	claim: ClaimWithProjects;
	onUpdate: () => void;
}

export default function ClaimCard({ claim, onUpdate }: ClaimCardProps) {
	const [updating, setUpdating] = useState(false);
	const [managingProjects, setManagingProjects] = useState(false);
	const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
	const [linkingProjects, setLinkingProjects] = useState(false);

	const formatAmount = (pence: number) => {
		const pounds = pence / 100;
		return new Intl.NumberFormat("en-GB", {
			style: "currency",
			currency: "GBP",
		}).format(pounds);
	};

	const formatDateRange = (startDate: string, endDate: string) => {
		const start = new Date(startDate).toLocaleDateString("en-GB");
		const end = new Date(endDate).toLocaleDateString("en-GB");
		return `${start} - ${end}`;
	};

	const handleStatusChange = async (newStatus: ClaimStatus) => {
		try {
			setUpdating(true);
			await claimsApi.update(claim.claimId, { status: newStatus });
			toast.success(`Status updated to ${newStatus}`);
			onUpdate();
		} catch (err: unknown) {
			const message = getErrorMessage(err);
			toast.error(message);
		} finally {
			setUpdating(false);
		}
	};

	const handleLinkProjects = async () => {
		if (selectedProjectIds.length === 0) return;

		try {
			setLinkingProjects(true);
			await claimsApi.linkProjects(claim.claimId, {
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
			setUpdating(true);
			await claimsApi.unlinkProject(claim.claimId, projectId);
			toast.success("Project unlinked successfully");
			onUpdate();
		} catch (err: unknown) {
			const message = getErrorMessage(err);
			toast.error(message);
		} finally {
			setUpdating(false);
		}
	};

	return (
		<div className="border rounded-lg p-6 bg-white shadow-sm">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-xl font-semibold">{claim.companyName}</h3>
					<p className="text-gray-600">
						{formatDateRange(
							claim.claimPeriod.startDate,
							claim.claimPeriod.endDate,
						)}
					</p>
				</div>
				<StatusBadge status={claim.status} />
			</div>

			<div className="mb-4">
				<p className="text-2xl font-bold text-gray-900">
					{formatAmount(claim.amount)}
				</p>
			</div>

			<div className="mb-4">
				<div className="flex justify-between items-center mb-2">
					<p className="text-sm font-medium text-gray-700">
						Linked Projects{" "}
						{claim.projects.length > 0 && `(${claim.projects.length})`}
					</p>
					<button
						type="button"
						onClick={() => setManagingProjects(!managingProjects)}
						className="text-sm text-blue-600 hover:text-blue-800 font-medium"
					>
						{managingProjects ? "Cancel" : "Manage Projects"}
					</button>
				</div>

				{claim.projects.length > 0 ? (
					<div className="space-y-1">
						{claim.projects.map((project) => (
							<div
								key={project.projectId}
								className="flex justify-between items-start text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
							>
								<div className="flex-1">
									<span className="font-medium">{project.name}</span>
									<span className="text-gray-500">
										{" "}
										- {project.description}
									</span>
								</div>
								<button
									type="button"
									onClick={() => handleUnlinkProject(project.projectId)}
									disabled={updating}
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
							excludeIds={claim.projects.map((p) => p.projectId)}
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

			<div className="flex items-center space-x-2">
				<span className="text-sm text-gray-600">Update status:</span>
				<button
					type="button"
					onClick={() => handleStatusChange("Draft")}
					disabled={updating || claim.status === "Draft"}
					className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					Draft
				</button>
				<button
					type="button"
					onClick={() => handleStatusChange("Submitted")}
					disabled={updating || claim.status === "Submitted"}
					className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					Submitted
				</button>
				<button
					type="button"
					onClick={() => handleStatusChange("Approved")}
					disabled={updating || claim.status === "Approved"}
					className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					Approved
				</button>
			</div>

			<div className="mt-4 text-xs text-gray-500">
				Created: {new Date(claim.createdAt).toLocaleString("en-GB")}
			</div>
		</div>
	);
}
