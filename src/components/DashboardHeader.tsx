interface DashboardHeaderProps {
  totalCalls: number;
  isRefreshing: boolean;
  onSimulateLoad: () => void;
}

function DashboardHeader({
  totalCalls,
  isRefreshing,
  onSimulateLoad,
}: DashboardHeaderProps) {
  return (
    <div className="dashboard-header">
      <div>
        <h1 className="dashboard-title">Dashboard de observabilidad</h1>
        <p className="dashboard-subtitle">
          Monitoreo en tiempo real de inventario, pedidos y pagos
        </p>
        <p className="dashboard-total-calls">
          Total de llamadas registradas: <strong>{totalCalls}</strong>
        </p>
      </div>

      <button
        className="simulate-button"
        onClick={onSimulateLoad}
        disabled={isRefreshing}
      >
        {isRefreshing ? "Simulando..." : "Simular carga"}
      </button>
    </div>
  );
}

export default DashboardHeader;