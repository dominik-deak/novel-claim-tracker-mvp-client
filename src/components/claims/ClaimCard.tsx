import { useState } from "react";
import { claimsApi } from "../../services/api";
import type { ClaimStatus, ClaimWithProjects } from "../../types";
import StatusBadge from "./StatusBadge";

interface ClaimCardProps {
	claim: ClaimWithProjects;
	onUpdate: () => void;
}

export default function ClaimCard({ claim, onUpdate }: ClaimCardProps) {
	const [updating, setUpdating] = useState(false);

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
			onUpdate();
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to update status";
			alert(`Error: ${message}`);
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

			{claim.projects.length > 0 && (
				<div className="mb-4">
					<p className="text-sm font-medium text-gray-700 mb-2">
						Linked Projects:
					</p>
					<div className="space-y-1">
						{claim.projects.map((project) => (
							<div
								key={project.projectId}
								className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded"
							>
								<span className="font-medium">{project.name}</span>
								<span className="text-gray-500"> - {project.description}</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="flex items-center space-x-2">
				<span className="text-sm text-gray-600">Update status:</span>
				<button
					type="button"
					onClick={() => handleStatusChange("Draft")}
					disabled={updating || claim.status === "Draft"}
					className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Draft
				</button>
				<button
					type="button"
					onClick={() => handleStatusChange("Submitted")}
					disabled={updating || claim.status === "Submitted"}
					className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Submitted
				</button>
				<button
					type="button"
					onClick={() => handleStatusChange("Approved")}
					disabled={updating || claim.status === "Approved"}
					className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
