import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { claimsApi } from "../../services/api";
import type { ClaimStatus, ClaimWithProjects } from "../../types";
import { getErrorMessage } from "../../utils/errorHandler";
import { formatAmount, formatDateRange } from "../../utils/formatting";
import ClaimProjectManager from "./ClaimProjectManager";
import StatusBadge from "./StatusBadge";

interface ClaimCardProps {
	claim: ClaimWithProjects;
	onUpdate: () => void;
}

export default function ClaimCard({ claim, onUpdate }: ClaimCardProps) {
	const { isSubmitter, isReviewer } = useAuth();
	const [updating, setUpdating] = useState(false);

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

			<ClaimProjectManager
				claimId={claim.claimId}
				projects={claim.projects}
				onUpdate={onUpdate}
			/>

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
				{isSubmitter && claim.status === "Draft" && (
					<button
						type="button"
						onClick={() => handleStatusChange("Submitted")}
						disabled={updating}
						className="px-3 py-1 text-sm bg-blue-200 text-blue-800 rounded hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						Submit
					</button>
				)}
				{isReviewer && claim.status === "Submitted" && (
					<button
						type="button"
						onClick={() => handleStatusChange("Approved")}
						disabled={updating}
						className="px-3 py-1 text-sm bg-green-200 text-green-800 rounded hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
					>
						Approve
					</button>
				)}
			</div>

			<div className="mt-4 text-xs text-gray-500">
				Created: {new Date(claim.createdAt).toLocaleString("en-GB")}
			</div>
		</div>
	);
}
