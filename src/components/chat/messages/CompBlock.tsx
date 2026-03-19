import { CompData } from "@/lib/types";

interface Props {
  data: CompData;
}

export default function CompBlock({ data }: Props) {
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="my-3 bg-background border border-border rounded-lg p-4">
      <div className="text-sm font-medium mb-1">
        {data.role} at {data.company}
      </div>
      <div className="text-xs text-muted mb-3">{data.location}</div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-surface rounded-lg p-3">
          <div className="text-[10px] text-muted uppercase tracking-wide mb-1">
            Base Salary
          </div>
          <div className="text-sm font-medium text-accent">
            {fmt(data.baseLow)} – {fmt(data.baseHigh)}
          </div>
        </div>
        <div className="bg-surface rounded-lg p-3">
          <div className="text-[10px] text-muted uppercase tracking-wide mb-1">
            Total Comp
          </div>
          <div className="text-sm font-medium text-accent">
            {fmt(data.totalLow)} – {fmt(data.totalHigh)}
          </div>
        </div>
      </div>

      {data.recommendation && (
        <div className="text-xs text-muted border-t border-border pt-2">
          <span className="text-accent font-medium">Recommendation:</span>{" "}
          {data.recommendation}
        </div>
      )}
    </div>
  );
}
