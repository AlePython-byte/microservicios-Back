import { Fragment, useMemo, useState } from "react";
import type { LogEntryResponse } from "../types";
import LogDetails from "./LogDetails";

interface LogsTableProps {
  logs?: LogEntryResponse[];
  page?: number;
  totalPages?: number;
  totalElements?: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function formatServiceName(serviceId: string): string {
  switch (serviceId) {
    case "inventory":
      return "Inventario";
    case "orders":
      return "Pedidos";
    case "payments":
      return "Pagos";
    default:
      return serviceId;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function LogsTable({
  logs = [],
  page = 0,
  totalPages = 0,
  totalElements = 0,
  onPreviousPage,
  onNextPage,
}: LogsTableProps) {
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const safeLogs = useMemo(() => (Array.isArray(logs) ? logs : []), [logs]);
  const hasLogs = safeLogs.length > 0;
  const safeTotalPages = Math.max(totalPages, 1);

  const toggleExpanded = (requestId: string) => {
    setExpandedRequestId((prev) => (prev === requestId ? null : requestId));
  };

  return (
    <section className="logs-section">
      <div className="section-header">
        <h2>Logs recientes</h2>
        <p>Total de registros encontrados: {totalElements}</p>
      </div>

      {!hasLogs ? (
        <div className="empty-state-card">
          No hay logs para los filtros seleccionados.
        </div>
      ) : (
        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Operación</th>
                <th>Estado</th>
                <th>Duración</th>
                <th>Fecha</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {safeLogs.map((log) => {
                const isExpanded = expandedRequestId === log.requestId;

                return (
                  <Fragment key={log.requestId}>
                    <tr>
                      <td>{formatServiceName(log.serviceId)}</td>
                      <td>{log.operation}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            log.status === "ERROR"
                              ? "status-pill-error"
                              : "status-pill-success"
                          }`}
                        >
                          {log.status === "ERROR" ? "Error" : "Éxito"}
                        </span>
                      </td>
                      <td>{log.durationMs} ms</td>
                      <td>{formatDate(log.timestamp)}</td>
                      <td>
                        <button
                          type="button"
                          className="table-action-button"
                          onClick={() => toggleExpanded(log.requestId)}
                        >
                          {isExpanded ? "Ocultar" : "Ver más"}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={6}>
                          <LogDetails log={log} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination-bar">
        <button
          type="button"
          className="ghost-button"
          onClick={onPreviousPage}
          disabled={page <= 0}
        >
          Anterior
        </button>

        <span>
          Página <strong>{page + 1}</strong> de <strong>{safeTotalPages}</strong>
        </span>

        <button
          type="button"
          className="ghost-button"
          onClick={onNextPage}
          disabled={page + 1 >= safeTotalPages}
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}

export default LogsTable;