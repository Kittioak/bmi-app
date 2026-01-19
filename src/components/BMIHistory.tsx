interface BMIRecord {
  id: string;
  weight: number;
  height: number;
  bmi_value: number;
  recorded_at: string;
}

interface BMIHistoryProps {
  records: BMIRecord[];
}

export default function BMIHistory({ records }: BMIHistoryProps) {
  if (records.length === 0) {
    return <p className="text-gray-500 text-center py-4">No records found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Weight (kg)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              BMI
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map((record) => {
            let statusColor = "text-gray-900";
            let statusText = "";

            if (record.bmi_value < 18.5) {
              statusText = "Underweight";
              statusColor = "text-blue-600";
            } else if (record.bmi_value < 23) {
              statusText = "Normal";
              statusColor = "text-green-600";
            } else if (record.bmi_value < 25) {
              statusText = "Overweight";
              statusColor = "text-yellow-600";
            } else if (record.bmi_value < 30) {
              statusText = "Obese L1";
              statusColor = "text-orange-600";
            } else {
              statusText = "Obese L2";
              statusColor = "text-red-600";
            }

            return (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(record.recorded_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {record.bmi_value.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${statusColor}`}>
                  {statusText}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
