import { CompData } from "@/lib/types";

interface Props {
  data: CompData;
}

export default function CompBlock({ data }: Props) {
  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <div className="my-3 bg-background border border-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm font-medium text-foreground">
          {data.role} at {data.company}
        </div>
      </div>
      <div className="text-xs text-muted mb-3 ml-6">{data.location}</div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-surface rounded-lg p-3">
          <div className="text-[10px] text-muted uppercase tracking-wide mb-1">
            Base Salary
          </div>
          <div className="text-sm font-semibold text-accent">
            {fmt(data.baseLow)} &ndash; {fmt(data.baseHigh)}
          </div>
        </div>
        <div className="bg-surface rounded-lg p-3">
          <div className="text-[10px] text-muted uppercase tracking-wide mb-1">
            Total Comp
          </div>
          <div className="text-sm font-semibold text-accent">
            {fmt(data.totalLow)} &ndash; {fmt(data.totalHigh)}
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
