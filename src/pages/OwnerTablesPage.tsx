import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  Power,
  PowerOff,
  CheckCircle2,
  X,
  HelpCircle,
  ChevronLeft,
  Users,
} from 'lucide-react';
import { RestaurantTable, SeatingType, TableShape } from '../types';

export const OwnerTablesPage: React.FC = () => {
  const {
    selectedRestaurant,
    tables,
    addTable,
    updateTable,
    deleteTable,
    toggleTableActive,
    navigate,
    showToast,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [selectedTableOnMap, setSelectedTableOnMap] = useState<RestaurantTable | null>(null);

  // Form states for Add Table
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [minCapacity, setMinCapacity] = useState(2);
  const [seatingType, setSeatingType] = useState<SeatingType>('indoor');
  const [shape, setShape] = useState<TableShape>('rectangle');
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);

  if (!selectedRestaurant) return null;

  const currentTables = tables.filter((t) => t.restaurantId === selectedRestaurant.id);

  const handleOpenAdd = () => {
    setTableNumber(`T-${currentTables.length + 1}`);
    setCapacity(4);
    setMinCapacity(2);
    setSeatingType('indoor');
    setShape('rectangle');
    setPosX(50);
    setPosY(50);
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      showToast('Table number is required', 'error');
      return;
    }

    addTable({
      restaurantId: selectedRestaurant.id,
      tableNumber: tableNumber.trim(),
      capacity: Number(capacity),
      minCapacity: Number(minCapacity),
      seatingType,
      shape,
      posX: Number(posX),
      posY: Number(posY),
      isActive: true,
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;

    updateTable(editingTable.id, {
      tableNumber: editingTable.tableNumber,
      capacity: Number(editingTable.capacity),
      minCapacity: Number(editingTable.minCapacity),
      seatingType: editingTable.seatingType,
      shape: editingTable.shape,
      posX: Number(editingTable.posX),
      posY: Number(editingTable.posY),
    });

    setEditingTable(null);
  };

  const getSeatingColor = (table: RestaurantTable) => {
    if (!table.isActive) return 'bg-stone-800 border-stone-700 text-stone-600 line-through';
    switch (table.seatingType) {
      case 'booth':
        return 'bg-purple-950/80 border-purple-500/60 text-purple-300';
      case 'window':
        return 'bg-blue-950/80 border-blue-500/60 text-blue-300';
      case 'patio':
        return 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300';
      case 'bar':
        return 'bg-amber-950/80 border-amber-500/60 text-amber-300';
      case 'private':
        return 'bg-rose-950/80 border-rose-500/60 text-rose-300';
      default:
        return 'bg-stone-800 border-stone-600 text-stone-200';
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('owner-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              Floor Plan Management
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              Dining Room Tables & Layout
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Configure table positions, capacities, seating zones, and active availability for {selectedRestaurant.name}.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Table
          </button>
        </div>

        {/* Visual Floor Plan Stage */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Interactive Floor Map
              </h2>
              <p className="text-xs text-stone-400">
                Click any table on the map to inspect or toggle its status.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-600 text-blue-300">
                Window
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-600 text-purple-300">
                Booth
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600 text-emerald-300">
                Patio
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-600 text-amber-300">
                Bar
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300">
                Private
              </span>
              <span className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-500">
                Disabled / Maintenance
              </span>
            </div>
          </div>

          {/* Canvas container */}
          <div className="relative w-full h-[420px] bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden p-6 select-none">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #78716c 1.5px, transparent 1.5px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Zone Markers */}
            <div className="absolute top-3 left-4 text-[10px] font-mono text-stone-500 uppercase">
              [ Host Stand & Main Entrance ]
            </div>
            <div className="absolute top-3 right-4 text-[10px] font-mono text-stone-500 uppercase">
              [ Service Bar & Kitchen Pass ]
            </div>
            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-stone-500 uppercase">
              [ Outdoor Patio Garden ]
            </div>

            {/* Tables on Floor */}
            {currentTables.map((t) => {
              const isSelected = selectedTableOnMap?.id === t.id;
              const colorClass = getSeatingColor(t);

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTableOnMap(t)}
                  style={{
                    left: `${t.posX}%`,
                    top: `${t.posY}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute p-2 border flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer ${colorClass} ${
                    t.shape === 'round' ? 'w-14 h-14 rounded-full' : 'w-16 h-12 rounded-lg'
                  } ${isSelected ? 'ring-2 ring-amber-400 scale-110 shadow-amber-500/30' : ''}`}
                >
                  <span className="text-[11px] font-bold font-mono leading-none">
                    {t.tableNumber}
                  </span>
                  <span className="text-[9px] opacity-80 mt-0.5 leading-none font-semibold">
                    {t.capacity}p
                  </span>
                </div>
              );
            })}
          </div>

          {/* Table Inspector Drawer */}
          {selectedTableOnMap && (
            <div className="mt-4 p-4 rounded-xl bg-stone-950 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center font-mono font-bold text-amber-400 text-sm">
                  {selectedTableOnMap.tableNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      Table {selectedTableOnMap.tableNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300">
                      {selectedTableOnMap.seatingType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        selectedTableOnMap.isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {selectedTableOnMap.isActive ? 'Active' : 'Disabled / Out of Service'}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    Seats {selectedTableOnMap.capacity} guests (min {selectedTableOnMap.minCapacity}) • Shape: {selectedTableOnMap.shape} • Position: ({selectedTableOnMap.posX}%, {selectedTableOnMap.posY}%)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleTableActive(selectedTableOnMap.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedTableOnMap.isActive
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {selectedTableOnMap.isActive ? 'Disable for Service' : 'Enable Table'}
                </button>
                <button
                  onClick={() => setEditingTable(selectedTableOnMap)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => setSelectedTableOnMap(null)}
                  className="p-1.5 text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tabular List View of Tables */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                All Configured Tables ({currentTables.length})
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Total dining capacity: {currentTables.reduce((acc, t) => acc + (t.isActive ? t.capacity : 0), 0)} active seats
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="py-3 px-4">Table #</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Seating Type</th>
                  <th className="py-3 px-4">Shape</th>
                  <th className="py-3 px-4">Floor Coordinates</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {currentTables.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {t.tableNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-white">{t.capacity}</span> guests{' '}
                      <span className="text-stone-500">(min {t.minCapacity})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 uppercase font-semibold text-[10px] text-amber-300">
                        {t.seatingType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-stone-400">
                      {t.shape}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 font-mono">
                      X: {t.posX}% • Y: {t.posY}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.isActive
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {t.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleTableActive(t.id)}
                          className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                            t.isActive
                              ? 'border-stone-700 text-stone-400 hover:text-white'
                              : 'border-emerald-700 text-emerald-400 hover:bg-emerald-950/40'
                          }`}
                          title={t.isActive ? 'Disable table' : 'Enable table'}
                        >
                          {t.isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setEditingTable(t)}
                          className="p-1.5 rounded-lg border border-stone-700 text-stone-400 hover:text-white cursor-pointer"
                          title="Edit table"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete table ${t.tableNumber}?`)) {
                              deleteTable(t.id);
                            }
                          }}
                          className="p-1.5 rounded-lg border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                          title="Delete table"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Table */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white font-display mb-1">
                Add Table to Floor Plan
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Define the table number, capacity, and floor plan coordinate.
              </p>

              <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Table Number *</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                    placeholder="e.g. T-12, Booth-5, Bar-3"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Max Capacity</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={capacity}
                      onChange={(e) => setCapacity(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Min Capacity</label>
                    <input
                      type="number"
                      min={1}
                      max={capacity}
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Seating Type</label>
                    <select
                      value={seatingType}
                      onChange={(e) => setSeatingType(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="indoor">Indoor</option>
                      <option value="booth">Booth</option>
                      <option value="window">Window</option>
                      <option value="patio">Patio</option>
                      <option value="bar">Bar</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Shape</label>
                    <select
                      value={shape}
                      onChange={(e) => setShape(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="round">Round</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Floor X (%)</label>
                    <input
                      type="number"
                      min={5}
                      max={95}
                      value={posX}
                      onChange={(e) => setPosX(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Floor Y (%)</label>
                    <input
                      type="number"
                      min={5}
                      max={95}
                      value={posY}
                      onChange={(e) => setPosY(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Save Table
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Table */}
        {editingTable && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white font-display mb-1">
                Edit Table {editingTable.tableNumber}
              </h3>
              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Table Number</label>
                  <input
                    type="text"
                    value={editingTable.tableNumber}
                    onChange={(e) => setEditingTable({ ...editingTable, tableNumber: e.target.value })}
                    required
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={editingTable.capacity}
                      onChange={(e) => setEditingTable({ ...editingTable, capacity: Number(e.target.value) })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Seating Style</label>
                    <select
                      value={editingTable.seatingType}
                      onChange={(e) => setEditingTable({ ...editingTable, seatingType: e.target.value as any })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="indoor">Indoor</option>
                      <option value="booth">Booth</option>
                      <option value="window">Window</option>
                      <option value="patio">Patio</option>
                      <option value="bar">Bar</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Floor X (%)</label>
                    <input
                      type="number"
                      value={editingTable.posX}
                      onChange={(e) => setEditingTable({ ...editingTable, posX: Number(e.target.value) })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Floor Y (%)</label>
                    <input
                      type="number"
                      value={editingTable.posY}
                      onChange={(e) => setEditingTable({ ...editingTable, posY: Number(e.target.value) })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTable(null)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
