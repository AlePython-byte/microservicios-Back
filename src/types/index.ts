export interface ServiceExecutionRequest {
  params: unknown[];
}

export interface ServiceExecutionResponse {
  requestId: string;
  serviceId: string;
  operation: string;
  status: "SUCCESS" | "ERROR";
  durationMs: number;
  timestamp: string;
  data: unknown | null;
  errorMessage: string | null;
}

export interface LogEntryResponse {
  requestId: string;
  serviceId: string;
  operation: string;
  durationMs: number;
  status: "SUCCESS" | "ERROR";
  timestamp: string;
  params: unknown[];
  response: unknown | null;
  errorMessage: string | null;
  stackTraceSummary: string | null;
}

export interface ServiceMetricsResponse {
  serviceId: string;
  totalCalls: number;
  successCount: number;
  errorCount: number;
  successRate: number;
  errorRate: number;
  averageResponseTimeMs: number;
  highlightAsCritical: boolean;
  last20Calls: LogEntryResponse[];
}

export interface MetricsSummaryResponse {
  generatedAt: string;
  totalCalls: number;
  services: ServiceMetricsResponse[];
}

export interface LogsPageResponse {
  content: LogEntryResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LogsFilters {
  service?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

export interface SimulateLoadRequest {
  totalRequests: number;
}