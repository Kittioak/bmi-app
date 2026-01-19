"use client";

import { useState } from "react";
import { calculateBMI, getBMIResult } from "@/lib/bmiUtils";
import { useRouter } from "next/navigation";

export default function BMIForm({ onRecordAdded }: { onRecordAdded?: () => void }) {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    label: string;
    color: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setError("Please enter valid weight and height.");
      return;
    }

    const bmi = calculateBMI(w, h);
    const result = getBMIResult(bmi);
    setBmiResult({ bmi, ...result });
  };

  const handleSave = async () => {
    if (!bmiResult) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bmi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight, height }),
      });

      if (res.ok) {
        setWeight("");
        setHeight("");
        setBmiResult(null);
        if (onRecordAdded) onRecordAdded();
        router.refresh();
      } else {
        setError("Failed to save record.");
      }
    } catch (err) {
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Calculate BMI</h2>
      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
      <form onSubmit={handleCalculate} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Calculate
        </button>
      </form>

      {bmiResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded border text-center">
          <p className="text-gray-600">Your BMI is</p>
          <p className="text-4xl font-bold my-2">{bmiResult.bmi}</p>
          <p className={`text-lg font-medium ${bmiResult.color}`}>
            {bmiResult.label}
          </p>
          <button
            onClick={handleSave}
            disabled={loading}
            className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? "Saving..." : "Save Record"}
          </button>
        </div>
      )}
    </div>
  );
}
