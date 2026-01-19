"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import BMIForm from "@/components/BMIForm";
import BMIChart from "@/components/BMIChart";
import BMIHistory from "@/components/BMIHistory";

interface BMIRecord {
  id: string;
  weight: number;
  height: number;
  bmi_value: number;
  recorded_at: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [records, setRecords] = useState<BMIRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchRecords = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoadingRecords(true);
    try {
      const res = await fetch("/api/bmi");
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch records", error);
    } finally {
      setLoadingRecords(false);
    }
  }, [status]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, refreshKey]);

  const handleRecordAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (status === "loading") {
    return <p className="p-8 text-center">Loading...</p>;
  }

  // Prepare chart data: map records to { date, bmi, weight }
  // Reverse records for chart (oldest to newest) because API returns newest first
  const chartData = [...records].reverse().map((r) => ({
    date: new Date(r.recorded_at).toLocaleDateString(),
    bmi: r.bmi_value,
    weight: r.weight,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Track your health journey</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
             <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium text-sm">
                {session?.user?.name || session?.user?.email}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <BMIForm onRecordAdded={handleRecordAdded} />
            
            {/* Quick Stats Card could go here */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
               <h3 className="font-bold text-lg mb-2">Did you know?</h3>
               <p className="text-blue-100 text-sm">Keeping your BMI within 18.5 - 24.9 significantly reduces health risks.</p>
            </div>
          </div>

          {/* Right Column: Chart & History */}
          <div className="lg:col-span-8 space-y-8">
            {/* Chart Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-gray-800">BMI Trend</h2>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last 30 Days</span>
               </div>
               <div className="flex-1 w-full">
                 {loadingRecords ? (
                    <div className="h-full flex items-center justify-center text-gray-400">Loading chart...</div>
                 ) : records.length > 0 ? (
                    <BMIChart data={chartData.slice(-30)} />
                 ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                       No data available. Add your first record!
                    </div>
                 )}
               </div>
            </div>

            {/* History Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">History Log</h2>
                <button 
                  onClick={fetchRecords} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  Refresh
                </button>
              </div>
              {loadingRecords ? (
                 <p className="text-center py-8 text-gray-500">Loading history...</p>
              ) : (
                 <BMIHistory records={records} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
