import { List, Trash2, MapPin } from "lucide-react";

/**
 * Displays all classrooms in a table format with seat usage information
 */
export default function ClassroomList({ classrooms, onDeleteClassroom }) {
  if (classrooms.length === 0) {
    return (
      <div className="section-card animate-fade-in">
        <h2 className="section-title">
          <List className="w-5 h-5 text-primary" />
          Classroom List
        </h2>
        <div className="text-center py-12 text-muted-foreground">
          <Building2Icon className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-medium">No classrooms added yet</p>
          <p className="text-sm mt-1 opacity-75">Add a classroom using the form above to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card animate-fade-in">
      <h2 className="section-title">
        <List className="w-5 h-5 text-primary" />
        Classroom List
        <span className="badge badge-primary ml-2">{classrooms.length} rooms</span>
      </h2>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Capacity</th>
              <th>Floor</th>
              <th>Washroom</th>
              <th>Used</th>
              <th>Available</th>
              <th>Usage</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((room, index) => {
              const remaining = room.capacity - room.usedSeats;
              const usagePercent = (room.usedSeats / room.capacity) * 100;
              
              return (
                <tr 
                  key={room.roomId} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td>
                    <span className="font-semibold mono text-foreground">{room.roomId}</span>
                  </td>
                  <td>
                    <span className="font-medium">{room.capacity}</span>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-sm">
                      <span className="text-muted-foreground text-xs">F</span>
                      <span className="font-medium">{room.floorNo}</span>
                    </span>
                  </td>
                  <td>
                    {room.nearWashroom ? (
                      <span className="inline-flex items-center gap-1 text-accent font-medium text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`font-semibold ${room.usedSeats > 0 ? "text-primary" : "text-muted-foreground"}`}>
                      {room.usedSeats}
                    </span>
                  </td>
                  <td>
                    <span className={`font-semibold ${remaining === 0 ? "text-destructive" : "text-success"}`}>
                      {remaining}
                    </span>
                  </td>
                  <td>
                    <UsageBar percent={usagePercent} />
                  </td>
                  <td>
                    <button
                      onClick={() => onDeleteClassroom(room.roomId)}
                      className="icon-button-danger"
                      title="Delete classroom"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4">
        <SummaryCard
          label="Total Capacity"
          value={classrooms.reduce((sum, r) => sum + r.capacity, 0)}
          variant="default"
        />
        <SummaryCard
          label="Used Seats"
          value={classrooms.reduce((sum, r) => sum + r.usedSeats, 0)}
          variant="primary"
        />
        <SummaryCard
          label="Available"
          value={classrooms.reduce((sum, r) => sum + (r.capacity - r.usedSeats), 0)}
          variant="success"
        />
      </div>
    </div>
  );
}

/**
 * Summary card component
 */
function SummaryCard({ label, value, variant }) {
  const variantClasses = {
    default: "text-foreground",
    primary: "text-primary",
    success: "text-success"
  };

  return (
    <div className="text-center p-3 rounded-xl bg-muted/50">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold mono ${variantClasses[variant]}`}>{value}</p>
    </div>
  );
}

/**
 * Visual usage bar component
 */
function UsageBar({ percent }) {
  let colorClass = "low";
  if (percent >= 80) colorClass = "high";
  else if (percent >= 50) colorClass = "medium";

  return (
    <div className="flex items-center gap-2">
      <div className="usage-bar-track">
        <div
          className={`usage-bar-fill ${colorClass}`}
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-10 mono">
        {Math.round(percent)}%
      </span>
    </div>
  );
}

/**
 * Empty state icon
 */
function Building2Icon({ className }) {
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
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
