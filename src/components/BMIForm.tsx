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
    <div className="bg-white p-8 rounded-xl shadow-lg mb-6 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Calculate BMI</h2>
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">{error}</div>}
      
      {bmiResult && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100 text-center animate-fade-in">
          <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Your BMI Result</p>
          <div className="text-5xl font-extrabold text-blue-600 mb-2">{bmiResult.bmi.toFixed(1)}</div>
          <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
             bmiResult.label === "Normal" ? "bg-green-100 text-green-700" :
             bmiResult.label === "Underweight" ? "bg-blue-100 text-blue-700" :
             "bg-orange-100 text-orange-700"
          }`}>
            {bmiResult.label}
          </div>
        </div>
      )}

      <form onSubmit={handleCalculate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="block w-full px-4 py-3 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 border"
              required
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Calculate
          </button>
          {bmiResult && (
             <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {loading ? "Saving..." : "Save Record"}
             </button>
          )}
        </div>
      </form>
    </div>


  );
}
