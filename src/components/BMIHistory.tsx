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
          {records.map((record, index) => {
            let statusColor = "bg-gray-100 text-gray-800";
            let statusText = "";

            if (record.bmi_value < 18.5) {
              statusText = "Underweight";
              statusColor = "bg-blue-100 text-blue-800";
            } else if (record.bmi_value < 23) {
              statusText = "Normal";
              statusColor = "bg-green-100 text-green-800";
            } else if (record.bmi_value < 25) {
              statusText = "Overweight";
              statusColor = "bg-yellow-100 text-yellow-800";
            } else if (record.bmi_value < 30) {
              statusText = "Obese L1";
              statusColor = "bg-orange-100 text-orange-800";
            } else {
              statusText = "Obese L2";
              statusColor = "bg-red-100 text-red-800";
            }

            return (
              <tr key={record.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(record.recorded_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {record.bmi_value.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                    {statusText}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
