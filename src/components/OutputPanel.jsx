import { History, CheckCircle2, AlertCircle, Clock, RotateCcw, ArrowRight } from "lucide-react";

/**
 * Displays allocation history and results
 */
export default function OutputPanel({ allocationHistory, onClearHistory }) {
  if (allocationHistory.length === 0) {
    return (
      <div className="section-card animate-fade-in">
        <h2 className="section-title">
          <History className="w-5 h-5 text-primary" />
          Allocation Results
        </h2>
        <div className="text-center py-12 text-muted-foreground">
          <ClipboardIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-medium">No allocations yet</p>
          <p className="text-sm mt-1 opacity-75">Allocate seats to see results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">
          <History className="w-5 h-5 text-primary" />
          Allocation Results
          <span className="badge badge-primary ml-2">{allocationHistory.length}</span>
        </h2>
        <button
          onClick={onClearHistory}
          className="text-sm text-muted-foreground hover:text-foreground 
                   flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-muted"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
        {allocationHistory.map((allocation, index) => (
          <AllocationEntry 
            key={allocation.timestamp} 
            allocation={allocation}
            number={allocationHistory.length - index}
            isLatest={index === 0}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Single allocation entry component
 */
function AllocationEntry({ allocation, number, isLatest }) {
  const { success, error, totalRequested, allocations, timestamp } = allocation;
  
  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  if (!success) {
    return (
      <div className="error-message animate-scale-in">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Allocation Failed</p>
              <span className="text-xs opacity-60 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formattedTime}
              </span>
            </div>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`allocation-card animate-scale-in ${isLatest ? 'animate-glow' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div>
            <span className="font-semibold text-foreground">
              Allocation #{number}
            </span>
            {isLatest && (
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-success/20 text-success font-medium">
                Latest
              </span>
            )}
          </div>
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formattedTime}
        </span>
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-success mono">{totalRequested}</span>
        <span className="text-sm text-muted-foreground">students allocated</span>
      </div>

      {/* Allocation details */}
      <div className="space-y-2">
        {allocations.map((alloc, idx) => (
          <div 
            key={alloc.roomId}
            className="bg-card rounded-lg p-3 border border-border flex items-center justify-between
                       hover:border-primary/30 transition-colors"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="font-bold text-primary mono text-sm">{alloc.roomId}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Floor {alloc.floorNo}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary mono">
                +{alloc.seatsAllocated}
              </span>
              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <span className="mono">{alloc.previousUsed}</span>
                <ArrowRight className="w-3 h-3" />
                <span className="mono font-medium">{alloc.newUsed}</span>
                <span className="opacity-50">/ {alloc.capacity}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">
        Used <span className="font-medium">{allocations.length}</span> classroom{allocations.length > 1 ? "s" : ""}
      </p>
    </div>
  );
}

/**
 * Empty state icon
 */
function ClipboardIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  );
}
