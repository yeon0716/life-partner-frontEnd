import { useEffect, useState, useMemo } from "react";
import { accountAPI } from "../../api/account/accountApi";

// 숫자 애니메이션 훅
function useCountUp(value, duration = 800) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if ((step > 0 && start >= value) || (step < 0 && start <= value)) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return display;
}

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

  // 🔥 max delta (그래프 기준)
  const maxDelta = useMemo(() => {
    if (!comparison?.categoryDeltas?.length) return 1;
    return Math.max(
      ...comparison.categoryDeltas.map(d => Math.abs(d.delta)),
      1
    );
  }, [comparison]);

  // 🔥 애니메이션 값
  const expenseChange = useCountUp(comparison?.expenseChange || 0);
  const incomeChange = useCountUp(comparison?.incomeChange || 0);

  if (!comparison) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        전월 대비
      </h3>

      {/* =========================
          📊 수입 / 지출 변화
      ========================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* 지출 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10">
          <p className="text-xs text-muted-foreground mb-1">지출 변화</p>

          <p
            className={`text-2xl font-bold ${
              expenseChange > 0 ? "text-destructive" : "text-primary"
            }`}
          >
            {expenseChange > 0 ? "+" : ""}
            {expenseChange.toFixed(1)}%
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            {comparison.prevExpense.toLocaleString()}원 →{" "}
            {comparison.currentExpense.toLocaleString()}원
          </p>
        </div>

        {/* 수입 */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10">
          <p className="text-xs text-muted-foreground mb-1">수입 변화</p>

          <p
            className={`text-2xl font-bold ${
              incomeChange >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {incomeChange > 0 ? "+" : ""}
            {incomeChange.toFixed(1)}%
          </p>

          <p className="text-xs text-muted-foreground mt-1">
            {comparison.prevIncome.toLocaleString()}원 →{" "}
            {comparison.currentIncome.toLocaleString()}원
          </p>
        </div>
      </div>

      {/* =========================
          📊 카테고리 변화 (좌우 그래프)
      ========================= */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-muted-foreground">
          카테고리별 변화
        </p>

        {!comparison.categoryDeltas?.length ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            비교할 데이터가 없어요 🙂
          </div>
        ) : (
          comparison.categoryDeltas
            .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
            .slice(0, 5)
            .map((item) => {
              const ratio = Math.abs(item.delta) / maxDelta;
              const width = ratio * 100;

              return (
                <div key={item.categoryName} className="space-y-1">
                  {/* 제목 */}
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{item.categoryName}</span>

                    <span
                      className={`text-xs font-medium ${
                        item.delta > 0
                          ? "text-destructive"
                          : "text-primary"
                      }`}
                    >
                      {item.delta > 0 ? "+" : ""}
                      {item.percent.toFixed(0)}%
                    </span>
                  </div>

                  {/* 그래프 */}
                  <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                    {/* 기준선 */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-border" />

                    {/* 감소 (왼쪽) */}
                    {item.delta < 0 && (
                      <div
                        className="absolute right-1/2 h-full bg-primary transition-all duration-500"
                        style={{ width: `${width / 2}%` }}
                      />
                    )}

                    {/* 증가 (오른쪽) */}
                    {item.delta > 0 && (
                      <div
                        className="absolute left-1/2 h-full bg-destructive transition-all duration-500"
                        style={{ width: `${width / 2}%` }}
                      />
                    )}
                  </div>

                  {/* 금액 */}
                  <div className="text-[11px] text-muted-foreground text-right">
                    {item.prevAmount.toLocaleString()} → {item.currentAmount.toLocaleString()}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}