import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MetricsSummaryResponse } from "../types";

interface ResponseTimeChartProps {
  summary: MetricsSummaryResponse | null;
}

interface ChartPoint {
  label: string;
  inventory: number | null;
  orders: number | null;
  payments: number | null;
}

function buildChartData(summary: MetricsSummaryResponse | null): ChartPoint[] {
  if (!summary || !summary.services || summary.services.length === 0) {
    return [];
  }

  const inventoryLogs =
    summary.services.find((service) => service.serviceId === "inventory")?.last20Calls ?? [];
  const ordersLogs =
    summary.services.find((service) => service.serviceId === "orders")?.last20Calls ?? [];
  const paymentsLogs =
    summary.services.find((service) => service.serviceId === "payments")?.last20Calls ?? [];

  const maxLength = Math.max(inventoryLogs.length, ordersLogs.length, paymentsLogs.length);

  if (maxLength === 0) {
    return [];
  }

  return Array.from({ length: maxLength }, (_, index) => {
    const inventoryLog = inventoryLogs[maxLength - 1 - index];
    const ordersLog = ordersLogs[maxLength - 1 - index];
    const paymentsLog = paymentsLogs[maxLength - 1 - index];

    return {
      label: `#${index + 1}`,
      inventory: inventoryLog?.durationMs ?? null,
      orders: ordersLog?.durationMs ?? null,
      payments: paymentsLog?.durationMs ?? null,
    };
  });
}

function ResponseTimeChart({ summary }: ResponseTimeChartProps) {
  const chartData = buildChartData(summary);

  return (
    <section className="chart-section">
      <div className="section-header">
        <h2>Tiempos de respuesta recientes</h2>
        <p>Últimas 20 llamadas por servicio</p>
      </div>

      {chartData.length === 0 ? (
        <div className="empty-state-card">
          Aún no hay suficientes datos para mostrar la gráfica.
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis unit=" ms" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="inventory" name="Inventario" strokeWidth={2} />
              <Line type="monotone" dataKey="orders" name="Pedidos" strokeWidth={2} />
              <Line type="monotone" dataKey="payments" name="Pagos" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ResponseTimeChart;