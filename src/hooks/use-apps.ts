import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, CreateAppPayload, UpdateAppPayload, LegalVersions, SnippetsResult, DiagnosticsResult } from "@/lib/api-client";
import { toast } from "sonner";

const APPS_KEY = ["apps"] as const;
const appKey = (id: string) => ["apps", id] as const;

// ---------- queries ----------

export function useApps() {
  return useQuery({
    queryKey: APPS_KEY,
    queryFn: () => api.listApps(),
  });
}

export function useApp(id: string | undefined) {
  return useQuery({
    queryKey: appKey(id!),
    queryFn: () => api.getApp(id!),
    enabled: !!id,
  });
}

export function useLegalVersions() {
  return useQuery<LegalVersions>({
    queryKey: ["legal-versions"],
    queryFn: () => api.getLegalVersions(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useSnippets(id: string, enabled = true) {
  return useQuery<SnippetsResult>({
    queryKey: ["snippets", id],
    queryFn: () => api.getSnippets(id),
    enabled: !!id && enabled,
  });
}

export function useSnippetByStack(id: string, stack: string) {
  return useQuery<{ stack: string; snippet: string }>({
    queryKey: ["snippet", id, stack],
    queryFn: () => api.getSnippetByStack(id, stack),
    enabled: !!id && !!stack,
  });
}

export function useDiagnostics(id: string) {
  return useMutation({
    mutationFn: () => api.getDiagnostics(id),
  });
}

// ---------- mutations ----------

export function useCreateApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAppPayload) => api.createApp(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: APPS_KEY });
    },
    onError: (err: Error) => {
      toast.error("Failed to create gateway", { description: err.message });
    },
  });
}

export function useUpdateApp(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAppPayload) => api.updateApp(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appKey(id) });
      toast.success("Settings saved");
    },
    onError: (err: Error) => {
      toast.error("Failed to save settings", { description: err.message });
    },
  });
}

export function useDeactivateApp(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.deactivateApp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appKey(id) });
      qc.invalidateQueries({ queryKey: APPS_KEY });
      toast.success("Gateway deactivated");
    },
    onError: (err: Error) => {
      toast.error("Action failed", { description: err.message });
    },
  });
}

export function useActivateApp(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.activateApp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: appKey(id) });
      qc.invalidateQueries({ queryKey: APPS_KEY });
      toast.success("Gateway activated");
    },
    onError: (err: Error) => {
      toast.error("Action failed", { description: err.message });
    },
  });
}

export function useDeleteApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteApp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: APPS_KEY });
      toast.success("Gateway deleted");
    },
    onError: (err: Error) => {
      toast.error("Failed to delete gateway", { description: err.message });
    },
  });
}

export function useVerifyApp(id: string) {
  return useMutation({
    mutationFn: () => api.verifyApp(id),
    onError: (err: Error) => {
      toast.error("Verification failed", { description: err.message });
    },
  });
}
