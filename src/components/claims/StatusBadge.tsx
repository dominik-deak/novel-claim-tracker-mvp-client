import type { ClaimStatus } from "../../types";

interface StatusBadgeProps {
	status: ClaimStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
	const colors = {
		Draft: "bg-gray-200 text-gray-800",
		Submitted: "bg-blue-200 text-blue-800",
		Approved: "bg-green-200 text-green-800",
	};

	return (
		<span
			className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}
		>
			{status}
		</span>
	);
}
