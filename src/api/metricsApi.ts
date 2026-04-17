import apiClient from "./client";
import type {
  LogsFilters,
  LogsPageResponse,
  MetricsSummaryResponse,
  ServiceExecutionRequest,
  ServiceExecutionResponse,
} from "../types";

function cleanParams(params: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

export async function getMetricsSummary(): Promise<MetricsSummaryResponse> {
  const response = await apiClient.get<MetricsSummaryResponse>("/api/metrics/summary");
  return response.data;
}

export async function getLogs(filters: LogsFilters = {}): Promise<LogsPageResponse> {
  const response = await apiClient.get<LogsPageResponse>("/api/metrics/logs", {
    params: cleanParams({
      service: filters.service,
      status: filters.status,
      from: filters.from,
      to: filters.to,
      page: filters.page ?? 0,
      size: filters.size ?? 20,
    }),
  });

  return response.data;
}

export async function simulateLoad(totalRequests: number): Promise<{ message: string; totalRequests: number }> {
  const response = await apiClient.post<{ message: string; totalRequests: number }>(
    "/api/metrics/simulate-load",
    { totalRequests }
  );

  return response.data;
}

export async function executeInventoryOperation(
  operation: string,
  request: ServiceExecutionRequest
): Promise<ServiceExecutionResponse> {
  const response = await apiClient.post<ServiceExecutionResponse>(
    `/api/services/inventory/${operation}`,
    request
  );

  return response.data;
}

export async function executeOrdersOperation(
  operation: string,
  request: ServiceExecutionRequest
): Promise<ServiceExecutionResponse> {
  const response = await apiClient.post<ServiceExecutionResponse>(
    `/api/services/orders/${operation}`,
    request
  );

  return response.data;
}

export async function executePaymentsOperation(
  operation: string,
  request: ServiceExecutionRequest
): Promise<ServiceExecutionResponse> {
  const response = await apiClient.post<ServiceExecutionResponse>(
    `/api/services/payments/${operation}`,
    request
  );

  return response.data;
}