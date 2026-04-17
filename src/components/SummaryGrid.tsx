import type { ServiceMetricsResponse } from "../types";
import ServiceCard from "./ServiceCard";

interface SummaryGridProps {
  services: ServiceMetricsResponse[];
}

function SummaryGrid({ services }: SummaryGridProps) {
  return (
    <section className="summary-grid">
      {services.map((service) => (
        <ServiceCard key={service.serviceId} service={service} />
      ))}
    </section>
  );
}

export default SummaryGrid;