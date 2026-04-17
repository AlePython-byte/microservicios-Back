import type { ServiceMetricsResponse } from "../types";

interface ServiceCardProps {
  service: ServiceMetricsResponse;
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

function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div
      className={`service-card ${
        service.highlightAsCritical ? "service-card-critical" : ""
      }`}
    >
      <div className="service-card-header">
        <h2>{formatServiceName(service.serviceId)}</h2>
        <span
          className={`service-badge ${
            service.highlightAsCritical ? "service-badge-critical" : "service-badge-normal"
          }`}
        >
          {service.highlightAsCritical ? "Crítico" : "Estable"}
        </span>
      </div>

      <div className="service-metrics">
        <div className="metric-item">
          <span className="metric-label">Total de llamadas</span>
          <strong>{service.totalCalls}</strong>
        </div>

        <div className="metric-item">
          <span className="metric-label">Tasa de éxito</span>
          <strong>{service.successRate}%</strong>
        </div>

        <div className="metric-item">
          <span className="metric-label">Tiempo promedio</span>
          <strong>{service.averageResponseTimeMs} ms</strong>
        </div>

        <div className="metric-item">
          <span className="metric-label">Tasa de error</span>
          <strong>{service.errorRate}%</strong>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;