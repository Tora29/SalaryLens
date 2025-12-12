import { TrendingUp, TrendingDown } from "lucide-react";

type Props = {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: string;
};

export function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
            {value}
          </p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {trendValue}
              </span>
              <span className="text-sm text-gray-400">vs 前年</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
          <Icon
            className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
