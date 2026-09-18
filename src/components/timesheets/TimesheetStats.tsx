// src/components/timesheets/TimesheetStats.tsx
interface TimesheetStatsProps {
  totalHours: number;
  target?: number;
}

const TimesheetStats = ({ totalHours, target = 8 }: TimesheetStatsProps) => {
  const progress = Math.min((totalHours / target) * 100, 100);
  const isOvertime = totalHours > target;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          Today's Logged Hours
        </h3>
        <div className="text-right">
          <div
            className={`text-2xl font-bold ${
              isOvertime ? "text-amber-500" : "text-gray-800"
            }`}
          >
            {totalHours.toFixed(1)}h{" "}
            <span className="text-sm text-gray-500 font-normal">
              / {target.toFixed(1)}h target
            </span>
          </div>
          {isOvertime && (
            <div className="text-xs text-amber-500 font-semibold">
              + Overtime Auto-Flagged
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isOvertime ? "bg-amber-500" : "bg-blue-600"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default TimesheetStats;
