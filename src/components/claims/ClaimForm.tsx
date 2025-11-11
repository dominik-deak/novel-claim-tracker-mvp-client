import { useState } from "react";
import toast from "react-hot-toast";
import { claimsApi } from "../../services/api";
import type { CreateClaimInput } from "../../types";
import { getErrorMessage } from "../../utils/errorHandler";
import { CreateClaimFormSchema } from "../../utils/validation";
import ProjectSelector from "../projects/ProjectSelector";

interface ClaimFormProps {
	onSuccess: () => void;
}

export default function ClaimForm({ onSuccess }: ClaimFormProps) {
	const [formData, setFormData] = useState<CreateClaimInput>({
		companyName: "",
		claimPeriod: {
			startDate: "",
			endDate: "",
		},
		amount: 0,
		projectIds: [],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = CreateClaimFormSchema.safeParse(formData);

		if (!result.success) {
			const newErrors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const path = issue.path.join(".");
				if (path === "claimPeriod.startDate") {
					newErrors.startDate = issue.message;
				} else if (path === "claimPeriod.endDate") {
					newErrors.endDate = issue.message;
				} else {
					newErrors[path] = issue.message;
				}
			}
			setErrors(newErrors);
			toast.error("Please fix the validation errors");
			return;
		}

		try {
			setSubmitting(true);
			setErrors({});
			await claimsApi.create(formData);
			toast.success("Claim created successfully");
			onSuccess();
		} catch (err: unknown) {
			const message = getErrorMessage(err);
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
			<div>
				<label
					htmlFor="company-name"
					className="block text-sm font-medium mb-1"
				>
					Company Name
				</label>
				<input
					id="company-name"
					type="text"
					value={formData.companyName}
					onChange={(e) =>
						setFormData({ ...formData, companyName: e.target.value })
					}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter company name"
				/>
				{errors.companyName && (
					<p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="start-date"
						className="block text-sm font-medium mb-1"
					>
						Claim Period Start
					</label>
					<input
						id="start-date"
						type="date"
						value={formData.claimPeriod.startDate}
						onChange={(e) =>
							setFormData({
								...formData,
								claimPeriod: {
									...formData.claimPeriod,
									startDate: e.target.value,
								},
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
					/>
					{errors.startDate && (
						<p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
					)}
				</div>

				<div>
					<label htmlFor="end-date" className="block text-sm font-medium mb-1">
						Claim Period End
					</label>
					<input
						id="end-date"
						type="date"
						value={formData.claimPeriod.endDate}
						onChange={(e) =>
							setFormData({
								...formData,
								claimPeriod: {
									...formData.claimPeriod,
									endDate: e.target.value,
								},
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
					/>
					{errors.endDate && (
						<p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
					)}
				</div>
			</div>

			<div>
				<label htmlFor="amount" className="block text-sm font-medium mb-1">
					Amount (in pence)
				</label>
				<input
					id="amount"
					type="number"
					value={formData.amount || ""}
					onChange={(e) =>
						setFormData({
							...formData,
							amount: Number.parseInt(e.target.value, 10) || 0,
						})
					}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="e.g., 50000 for £500.00"
					min="0"
				/>
				{errors.amount && (
					<p className="text-red-500 text-sm mt-1">{errors.amount}</p>
				)}
				<p className="text-sm text-gray-500 mt-1">
					Enter amount in pence (e.g., 50000 = £500.00)
				</p>
			</div>

			<ProjectSelector
				selectedIds={formData.projectIds || []}
				onChange={(ids) => setFormData({ ...formData, projectIds: ids })}
			/>

			<button
				type="submit"
				disabled={submitting}
				className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
			>
				{submitting ? "Creating..." : "Create Claim"}
			</button>
		</form>
	);
}
