import { useState } from "react";

export interface FiltersState {
  service: string;
  status: string;
  from: string;
  to: string;
}

interface FiltersBarProps {
  initialFilters: FiltersState;
  onApply: (filters: FiltersState) => void;
  onReset: () => void;
}

function FiltersBar({ initialFilters, onApply, onReset }: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<FiltersState>(initialFilters);

  const handleChange = (key: keyof FiltersState, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: FiltersState = {
      service: "",
      status: "",
      from: "",
      to: "",
    };

    setLocalFilters(emptyFilters);
    onReset();
  };

  return (
    <section className="filters-section">
      <div className="section-header">
        <h2>Filtros de logs</h2>
        <p>Filtra por servicio, estado y rango de fechas</p>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="service">Servicio</label>
          <select
            id="service"
            value={localFilters.service}
            onChange={(e) => handleChange("service", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="inventory">Inventario</option>
            <option value="orders">Pedidos</option>
            <option value="payments">Pagos</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={localFilters.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="SUCCESS">Éxito</option>
            <option value="ERROR">Error</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="from">Desde</label>
          <input
            id="from"
            type="datetime-local"
            value={localFilters.from}
            onChange={(e) => handleChange("from", e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="to">Hasta</label>
          <input
            id="to"
            type="datetime-local"
            value={localFilters.to}
            onChange={(e) => handleChange("to", e.target.value)}
          />
        </div>
      </div>

      <div className="filters-actions">
        <button className="secondary-button" onClick={handleApply}>
          Aplicar filtros
        </button>
        <button className="ghost-button" onClick={handleReset}>
          Limpiar
        </button>
      </div>
    </section>
  );
}

export default FiltersBar;