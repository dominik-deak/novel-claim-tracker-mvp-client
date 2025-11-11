import { useCallback, useEffect, useState } from "react";
import { claimsApi } from "../services/api";
import type { ClaimWithProjects } from "../types";

export function useClaims(statusFilter?: string) {
	const [claims, setClaims] = useState<ClaimWithProjects[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadClaims = useCallback(async () => {
		try {
			setLoading(true);
			const data = await claimsApi.list(statusFilter);
			setClaims(data);
			setError(null);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Failed to load claims";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, [statusFilter]);

	useEffect(() => {
		loadClaims();
	}, [loadClaims]);

	const refresh = () => {
		loadClaims();
	};

	return { claims, loading, error, refresh };
}
