import { useCallback, useEffect, useState } from "react";
import "./App.css";
import DashboardHeader from "./components/DashboardHeader";
import FiltersBar, { type FiltersState } from "./components/FiltersBar";
import LogsTable from "./components/LogsTable";
import ResponseTimeChart from "./components/ResponseTimeChart";
import SummaryGrid from "./components/SummaryGrid";
import { getLogs, getMetricsSummary, simulateLoad } from "./api/metricsApi";
import type { LogEntryResponse, LogsPageResponse, MetricsSummaryResponse } from "./types";

const DEFAULT_FILTERS: FiltersState = {
  service: "",
  status: "",
  from: "",
  to: "",
};

function toApiDateTime(value: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString().slice(0, 19);
}

function App() {
  const [summary, setSummary] = useState<MetricsSummaryResponse | null>(null);
  const [logs, setLogs] = useState<LogEntryResponse[]>([]);
  const [logsPage, setLogsPage] = useState<LogsPageResponse>({
    content: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSummary = useCallback(async () => {
    const data = await getMetricsSummary();
    setSummary(data);
  }, []);

  const loadLogs = useCallback(async (targetPage: number, activeFilters: FiltersState) => {
    const data = await getLogs({
      service: activeFilters.service || undefined,
      status: activeFilters.status || undefined,
      from: toApiDateTime(activeFilters.from),
      to: toApiDateTime(activeFilters.to),
      page: targetPage,
      size: 10,
    });

    setLogs(data.content);
    setLogsPage(data);
  }, []);

  const loadDashboardData = useCallback(
    async (showLoader = false) => {
      try {
        if (showLoader) {
          setIsLoading(true);
        }

        setErrorMessage("");

        await Promise.all([loadSummary(), loadLogs(page, filters)]);
      } catch (error) {
        console.error(error);
        setErrorMessage("No se pudieron cargar los datos del dashboard.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [filters, loadLogs, loadSummary, page]
  );

  useEffect(() => {
    void loadDashboardData(true);
  }, [loadDashboardData]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadDashboardData(false);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [loadDashboardData]);

  const handleSimulateLoad = async () => {
  try {
    setIsRefreshing(true);
    setErrorMessage("");
    await simulateLoad(30);
    await loadDashboardData(false);
  } catch (error: any) {
    console.error(error);

    const backendMessage =
      error?.response?.data?.message ||
      error?.response?.data?.details ||
      error?.message ||
      "No se pudo simular la carga.";

    setErrorMessage(String(backendMessage));
    setIsRefreshing(false);
  }
};

  const handleApplyFilters = async (nextFilters: FiltersState) => {
    setFilters(nextFilters);
    setPage(0);

    try {
      setErrorMessage("");
      await loadLogs(0, nextFilters);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron aplicar los filtros.");
    }
  };

  const handleResetFilters = async () => {
    setFilters(DEFAULT_FILTERS);
    setPage(0);

    try {
      setErrorMessage("");
      await loadLogs(0, DEFAULT_FILTERS);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudieron limpiar los filtros.");
    }
  };

  const handlePreviousPage = async () => {
    const nextPage = Math.max(page - 1, 0);
    setPage(nextPage);

    try {
      await loadLogs(nextPage, filters);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cambiar de página.");
    }
  };

  const handleNextPage = async () => {
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      await loadLogs(nextPage, filters);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cambiar de página.");
    }
  };

  if (isLoading) {
    return (
      <main className="app-shell">
        <div className="state-card">Cargando dashboard...</div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="app-container">
        <DashboardHeader
          totalCalls={summary?.totalCalls ?? 0}
          isRefreshing={isRefreshing}
          onSimulateLoad={handleSimulateLoad}
        />

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        <SummaryGrid services={summary?.services ?? []} />

        <ResponseTimeChart summary={summary} />

        <FiltersBar
          initialFilters={filters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
        />

        <LogsTable
        logs={logs}
        page={logsPage.page}
        totalPages={logsPage.totalPages}
        totalElements={logsPage.totalElements}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
/>
      </div>
    </main>
  );
}

export default App;