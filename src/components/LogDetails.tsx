import type { LogEntryResponse } from "../types";

interface LogDetailsProps {
  log: LogEntryResponse;
}

function safeStringify(value: unknown): string {
  if (value === null || value === undefined) {
    return "Sin datos";
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function LogDetails({ log }: LogDetailsProps) {
  return (
    <div className="log-details">
      <div className="log-details-grid">
        <div className="log-detail-card">
          <h4>Parámetros de entrada</h4>
          <pre>{safeStringify(log.params)}</pre>
        </div>

        <div className="log-detail-card">
          <h4>Respuesta completa</h4>
          <pre>{safeStringify(log.response)}</pre>
        </div>
      </div>

      {log.errorMessage ? (
        <div className="log-detail-card error-detail-card">
          <h4>Error</h4>
          <pre>{log.errorMessage}</pre>
        </div>
      ) : null}

      {log.stackTraceSummary ? (
        <div className="log-detail-card">
          <h4>Resumen del stack trace</h4>
          <pre>{log.stackTraceSummary}</pre>
        </div>
      ) : null}
    </div>
  );
}

export default LogDetails;