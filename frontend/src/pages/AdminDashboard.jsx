import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "../components/InfoCard";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHero from "../components/PageHero";
import StatCard from "../components/StatCard";
import {
  exportAdminCsv,
  fetchAdminDashboard,
  fetchAdminResponses,
  fetchAdminStatistics
} from "../services/api";
import { clearAdminToken } from "../utils/adminAuth";

const tones = ["blue", "emerald", "amber", "rose", "blue", "amber"];

const PieChartCard = ({ title, items }) => {
  const total = items.reduce((sum, item) => sum + (item.value || 0), 0) || 1;
  let offset = 0;
  const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#0ea5e9", "#8b5cf6"];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-6 grid items-center gap-6 md:grid-cols-[220px_1fr]">
        <svg viewBox="0 0 42 42" className="mx-auto h-52 w-52 -rotate-90">
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
          {items.map((item, index) => {
            const value = item.value || 0;
            const dash = (value / total) * 100;
            const circle = (
              <circle
                key={item.label}
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="5"
                strokeDasharray={`${dash} ${100 - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3 w-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                <span className="text-slate-700">{item.label}</span>
              </div>
              <span className="font-semibold text-ink">{item.value || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BarChartCard = ({ title, items }) => {
  const maxValue = Math.max(...items.map((item) => item.value || 0), 1);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-panel">
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>{item.label}</span>
              <span>{item.value || 0}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${((item.value || 0) / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [responses, setResponses] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const [dashboardResponse, responsesResponse, statisticsResponse] = await Promise.all([
          fetchAdminDashboard(),
          fetchAdminResponses(),
          fetchAdminStatistics()
        ]);

        setDashboard(dashboardResponse.data);
        setResponses(responsesResponse.data || []);
        setStatistics(statisticsResponse.data);
      } catch (apiError) {
        const message = apiError.response?.data?.message || "Failed to load admin dashboard.";
        setError(message);

        if (apiError.response?.status === 401) {
          clearAdminToken();
          navigate("/admin/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const statItems = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    return [
      { label: "Total Tests", value: dashboard.totalTests, tone: tones[0] },
      { label: "Normal Vision", value: dashboard.normalVision, tone: tones[1] },
      { label: "Deuteranopia", value: dashboard.deuteranopia, tone: tones[2] },
      { label: "Protanopia", value: dashboard.protanopia, tone: tones[3] },
      { label: "Tritanopia", value: dashboard.tritanopia, tone: tones[4] },
      { label: "Incomplete Tests", value: dashboard.incompleteTests, tone: tones[5] }
    ];
  }, [dashboard]);

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportAdminCsv();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "visioncheck-export.csv";
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHero
        eyebrow="Protected Analytics Workspace"
        title="Admin Dashboard"
        description="Review completed screenings, track diagnosis patterns, inspect recent responses, and export structured CSV data for downstream analysis."
        asideTitle="Admin Actions"
        asideDescription="Use the export action for dataset preparation and logout when you finish the session."
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {exporting ? "Exporting..." : "Download CSV"}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
          >
            Logout
          </button>
        </div>
      </PageHero>

      {loading ? <div className="mt-8"><LoadingSpinner label="Loading dashboard data..." /></div> : null}
      {error ? <p className="mt-8 text-danger">{error}</p> : null}

      {!loading && !error && dashboard && statistics ? (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statItems.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <PieChartCard title="Diagnosis Distribution" items={statistics.diagnosisDistribution || []} />
            <BarChartCard title="Monthly Screening Volume" items={statistics.monthlyAssessments || []} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <InfoCard
              eyebrow="Recent Responses"
              title="Latest Screening Records"
              description="The table below is sourced from protected response data and reflects completion status for each saved test."
              className="overflow-hidden"
            >
              <div className="-mx-5 mt-0 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Date", "Diagnosis", "Completion Status"].map((heading) => (
                        <th key={heading} className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(dashboard.recentResponses || []).map((item) => (
                      <tr key={item._id}>
                        <td className="px-5 py-4 text-sm text-slate-700">{new Date(item.date).toLocaleString()}</td>
                        <td className="px-5 py-4 text-sm font-medium text-ink">{item.diagnosis}</td>
                        <td className="px-5 py-4 text-sm">
                          <span className={`rounded-full px-3 py-1 ${item.completionStatus === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {item.completionStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </InfoCard>

            <InfoCard
              eyebrow="Response Archive"
              title="Saved Responses"
              description={`Total protected records loaded: ${responses.length}`}
            >
              <div className="space-y-3">
                {responses.slice(0, 6).map((item) => (
                  <div key={item._id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-ink">{item.name || "Anonymous"}</span>
                      <span>{new Date(item.completedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <span>{item.diagnosis}</span>
                      <span className={item.completionStatus === "completed" ? "text-emerald-700" : "text-amber-700"}>
                        {item.completionStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>
        </>
      ) : null}
    </main>
  );
};

export default AdminDashboard;
