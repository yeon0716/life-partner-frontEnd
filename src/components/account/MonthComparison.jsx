import { useEffect, useState } from "react";
import { accountAPI } from "../../api/account/accountApi";

export default function MonthComparison({ memberId, month }) {

  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    fetchData();
  }, [month]);

  const fetchData = async () => {
    try {
      const res = await accountAPI.getCompare(memberId, month);
      setComparison(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!comparison) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">전월 대비</h3>

      {/* Main */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">지출 변화</p>
          <p className={`text-2xl font-bold ${
            comparison.expenseChange > 0 ? 'text-destructive' : 'text-primary'
          }`}>
            {comparison.expenseChange > 0 ? '+' : ''}{comparison.expenseChange.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {comparison.prevExpense.toLocaleString()} → {comparison.currentExpense.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">수입 변화</p>
          <p className={`text-2xl font-bold ${
            comparison.incomeChange >= 0 ? 'text-primary' : 'text-destructive'
          }`}>
            {comparison.incomeChange > 0 ? '+' : ''}{comparison.incomeChange.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {comparison.prevIncome.toLocaleString()} → {comparison.currentIncome.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground">카테고리별 변화</p>

        {comparison.categoryDeltas
          .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
          .slice(0, 4)
          .map(item => (
            <div key={item.categoryName} className="flex items-center gap-3">
              <span className="text-sm w-16">{item.categoryName}</span>

              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    item.delta > 0 ? 'bg-destructive' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(Math.abs(item.percent), 100)}%` }}
                />
              </div>

              <span className={`text-xs w-14 text-right ${
                item.delta > 0 ? 'text-destructive' : 'text-primary'
              }`}>
                {item.delta > 0 ? '+' : ''}{item.percent.toFixed(0)}%
              </span>
            </div>
        ))}
      </div>
    </div>
  );
}