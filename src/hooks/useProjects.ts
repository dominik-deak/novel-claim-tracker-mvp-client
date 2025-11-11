import { useCallback, useEffect, useState } from "react";
import { projectsApi } from "../services/api";
import type { Project } from "../types";

export function useProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadProjects = useCallback(async () => {
		try {
			setLoading(true);
			const data = await projectsApi.list();
			setProjects(data);
			setError(null);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to load projects";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadProjects();
	}, [loadProjects]);

	const refresh = () => {
		loadProjects();
	};

	return { projects, loading, error, refresh };
}
