import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import { fetchDashboardStats, fetchResults } from "../services/api";

const parseTracingPayload = (payload) => {
  try {
    const parsed = JSON.parse(payload || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedResultId, setSelectedResultId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pageSize = 5;

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const [resultsResponse, statsResponse] = await Promise.all([fetchResults(), fetchDashboardStats()]);
        setResults(resultsResponse.data || []);
        setStats(statsResponse);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to load stored results.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  const filteredResults = useMemo(() => {
    const matched = results.filter((item) =>
      [item._id, item.diagnosis, ...(item.answers || []).map((entry) => `${entry.plate}:${entry.answer}`)]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return matched.sort((first, second) => {
      const firstDate = new Date(first.date).getTime();
      const secondDate = new Date(second.date).getTime();
      return sortOrder === "asc" ? firstDate - secondDate : secondDate - firstDate;
    });
  }, [results, searchTerm, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const paginatedResults = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const selectedResult = filteredResults.find((item) => item._id === selectedResultId);
  const traceImages = parseTracingPayload(selectedResult?.tracingImageBase64);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink">Admin Dashboard</h1>
            <p className="mt-2 text-slate-600">Search records, sort by date, inspect tracing submissions, and monitor dashboard statistics.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search result ID, diagnosis, or answers"
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
            />
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? <div className="mt-8"><LoadingSpinner label="Loading dashboard data..." /></div> : null}
        {error ? <p className="mt-8 text-danger">{error}</p> : null}

        {!loading && !error && stats ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total Tests" value={stats.totalTests} tone="blue" />
            <StatCard label="Normal Cases" value={stats.normalVision} tone="emerald" />
            <StatCard label="Protanopia Cases" value={stats.protanopia} tone="rose" />
            <StatCard label="Deuteranopia Cases" value={stats.deuteranopia} tone="amber" />
            <StatCard label="Borderline Cases" value={stats.borderline} tone="blue" />
          </div>
        ) : null}

        {!loading && !error ? (
          <div className="mt-8 overflow-x-auto rounded-[1.5rem] border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {["Result ID", "Score", "Diagnosis", "Date", "Action"].map((heading) => (
                    <th key={heading} className="px-4 py-4 text-left text-sm font-semibold text-slate-600">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedResults.map((result) => (
                  <tr key={result._id}>
                    <td className="px-4 py-4 text-sm font-medium text-ink">{result._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{result.numberScore}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{result.diagnosis}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{new Date(result.date).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedResultId((current) => (current === result._id ? "" : result._id))
                        }
                        className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        {selectedResultId === result._id ? "Hide" : "View Trace"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading && !error && filteredResults.length > pageSize ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredResults.length)} of {filteredResults.length} records
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}

        {selectedResult ? (
          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-ink">Tracing Review for Record {selectedResult._id.slice(-8).toUpperCase()}</h2>
            <div className="mt-4 rounded-[1.25rem] bg-white p-4">
              <p className="text-sm text-slate-500">Diagnosis</p>
              <p className="mt-1 font-semibold text-ink">{selectedResult.diagnosis}</p>
              <p className="mt-3 text-sm text-slate-500">Answers</p>
              <p className="mt-1 text-sm text-slate-700">
                {(selectedResult.answers || []).map((entry) => `P${entry.plate}: ${entry.answer}`).join(", ") || "No answers stored"}
              </p>
            </div>
            {traceImages.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">No tracing submissions were stored for this record.</p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {traceImages.map((trace) => (
                  <div key={trace.plate} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                    <p className="mb-3 text-sm font-semibold text-slate-600">Plate {trace.plate}</p>
                    <img
                      src={trace.imageBase64}
                      alt={`Tracing for plate ${trace.plate}`}
                      className="w-full rounded-2xl border border-slate-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default AdminDashboard;
