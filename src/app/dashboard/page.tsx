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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <span className="text-gray-600">
              Welcome, {session?.user?.name || session?.user?.email}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <BMIForm onRecordAdded={handleRecordAdded} />
          </div>
          <div className="bg-white p-6 rounded shadow flex flex-col">
             <h2 className="text-xl font-semibold mb-4">BMI Trend (Last 30 Records)</h2>
             {loadingRecords ? (
                <p className="text-center text-gray-500 my-auto">Loading chart...</p>
             ) : records.length > 0 ? (
                <BMIChart data={chartData.slice(-30)} />
             ) : (
                <p className="text-center text-gray-500 my-auto">No data to display chart.</p>
             )}
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">History</h2>
          {loadingRecords ? (
             <p className="text-center py-4">Loading history...</p>
          ) : (
             <BMIHistory records={records} />
          )}
        </div>
      </div>
    </div>
  );
}
