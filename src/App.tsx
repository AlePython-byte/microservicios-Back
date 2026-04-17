import { useCallback, useEffect, useState } from "react";
import "./App.css";
import DashboardHeader from "./components/DashboardHeader";
import ResponseTimeChart from "./components/ResponseTimeChart";
import SummaryGrid from "./components/SummaryGrid";
import { getMetricsSummary, simulateLoad } from "./api/metricsApi";
import type { MetricsSummaryResponse } from "./types";

function App() {
  const [summary, setSummary] = useState<MetricsSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSummary = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }

      setErrorMessage("");
      const data = await getMetricsSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo cargar el resumen del sistema.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary(true);
  }, [loadSummary]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadSummary(false);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [loadSummary]);

  const handleSimulateLoad = async () => {
    try {
      setIsRefreshing(true);
      setErrorMessage("");
      await simulateLoad(30);
      await loadSummary(false);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo simular la carga.");
      setIsRefreshing(false);
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
      </div>
    </main>
  );
}

export default App;