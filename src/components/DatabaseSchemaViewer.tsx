import React, { useState } from 'react';
import { DATABASE_SCHEMAS } from '../data/blueprintData';
import { SchemaTable } from '../types/blueprint';
import { 
  Database, 
  Table, 
  Code, 
  Copy, 
  Check, 
  FileCode, 
  Smartphone, 
  Server,
  Layers
} from 'lucide-react';

export const DatabaseSchemaViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<SchemaTable>(DATABASE_SCHEMAS[0]);
  const [viewMode, setViewMode] = useState<'columns' | 'sql' | 'room'>('columns');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Database Schema &amp; Storage Blueprint</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Production-grade relational database design for PostgreSQL / Supabase, paired with Android Jetpack Room (SQLCipher) on-device cache models.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              5 Core Schemas &bull; Full DDL &amp; Room Models
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {/* Table Selector Tabs */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-800">
          {DATABASE_SCHEMAS.map((table) => {
            const isSelected = selectedTable.name === table.name;
            return (
              <button
                key={table.name}
                onClick={() => setSelectedTable(table)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>{table.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Table Overview & View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <span>table: {selectedTable.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedTable.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('columns')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'columns' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Schema Columns
              </button>
              <button
                onClick={() => setViewMode('sql')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'sql' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-3 h-3" />
                <span>PostgreSQL DDL</span>
              </button>
              <button
                onClick={() => setViewMode('room')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  viewMode === 'room' ? 'bg-slate-800 text-blue-400 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Android Room Entity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content based on viewMode */}
        {viewMode === 'columns' && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Column Name</th>
                  <th className="py-3 px-4">Data Type</th>
                  <th className="py-3 px-4">Constraints &amp; Defaults</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60">
                {selectedTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">{col.name}</td>
                    <td className="py-3 px-4 font-mono text-blue-300">{col.type}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{col.constraints}</td>
                    <td className="py-3 px-4 text-slate-300">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'sql' && (
          <div className="relative">
            <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-xl border border-b-0 border-slate-800 text-xs text-slate-400">
              <span className="font-mono">PostgreSQL DDL Definition (Backend)</span>
              <button
                onClick={() => handleCopy(selectedTable.sqlDdl)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-b-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
              {selectedTable.sqlDdl}
            </pre>
          </div>
        )}

        {viewMode === 'room' && (
          <div className="relative">
            <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-xl border border-b-0 border-slate-800 text-xs text-slate-400">
              <span className="font-mono">Android Room Entity (Kotlin + SQLCipher)</span>
              <button
                onClick={() => handleCopy(selectedTable.roomEntity)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-blue-400 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Kotlin'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-b-xl border border-slate-800 text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed">
              {selectedTable.roomEntity}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
