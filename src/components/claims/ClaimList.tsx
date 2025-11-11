import { useState } from "react";
import { useClaims } from "../../hooks/useClaims";
import ClaimCard from "./ClaimCard";

export default function ClaimList() {
	const [statusFilter, setStatusFilter] = useState<string | undefined>();
	const { claims, loading, error, refresh } = useClaims(statusFilter);

	if (loading) {
		return <div className="text-center py-8">Loading claims...</div>;
	}
	if (error) {
		return <div className="text-red-600 py-8">Error: {error}</div>;
	}

	return (
		<div>
			<div className="mb-6 flex items-center space-x-3">
				<label htmlFor="status-filter" className="text-sm font-medium">
					Filter by status:
				</label>
				<select
					id="status-filter"
					value={statusFilter || ""}
					onChange={(e) => setStatusFilter(e.target.value || undefined)}
					className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="">All</option>
					<option value="Draft">Draft</option>
					<option value="Submitted">Submitted</option>
					<option value="Approved">Approved</option>
				</select>
			</div>

			{claims.length === 0 ? (
				<div className="text-center py-8 text-gray-500">
					No claims found. Create one to get started!
				</div>
			) : (
				<div className="space-y-4">
					{claims.map((claim) => (
						<ClaimCard key={claim.claimId} claim={claim} onUpdate={refresh} />
					))}
				</div>
			)}
		</div>
	);
}
