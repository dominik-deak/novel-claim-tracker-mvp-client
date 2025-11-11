import { useState } from "react";
import { projectsApi } from "../../services/api";
import type { CreateProjectInput } from "../../types";

interface ProjectFormProps {
	onSuccess: () => void;
}

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
	const [formData, setFormData] = useState<CreateProjectInput>({
		name: "",
		description: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newErrors: Record<string, string> = {};
		if (!formData.name.trim()) {
			newErrors.name = "Project name is required";
		}
		if (!formData.description.trim()) {
			newErrors.description = "Description is required";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			setSubmitting(true);
			setErrors({});
			await projectsApi.create(formData);
			onSuccess();
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to create project";
			setErrors({ submit: message });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
			<div>
				<label
					htmlFor="project-name"
					className="block text-sm font-medium mb-1"
				>
					Project Name
				</label>
				<input
					id="project-name"
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Enter project name"
				/>
				{errors.name && (
					<p className="text-red-500 text-sm mt-1">{errors.name}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="project-description"
					className="block text-sm font-medium mb-1"
				>
					Description
				</label>
				<textarea
					id="project-description"
					value={formData.description}
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
					rows={4}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Describe the R&D project"
				/>
				{errors.description && (
					<p className="text-red-500 text-sm mt-1">{errors.description}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={submitting}
				className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{submitting ? "Creating..." : "Create Project"}
			</button>

			{errors.submit && <p className="text-red-500 mt-2">{errors.submit}</p>}
		</form>
	);
}
