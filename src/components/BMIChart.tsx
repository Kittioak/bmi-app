"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BMIChartProps {
  data: {
    date: string;
    bmi: number;
    weight: number;
  }[];
}

export default function BMIChart({ data }: BMIChartProps) {
  // Reverse data to show oldest to newest if needed, or assume data comes sorted
  // Here we assume data is passed in chronological order or we sort it.
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" domain={['auto', 'auto']} />
          <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bmi"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="BMI"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="weight"
            stroke="#82ca9d"
            name="Weight (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
