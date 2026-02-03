import { useState } from "react";
import { Users, Zap, AlertCircle } from "lucide-react";

/**
 * Form component for allocating exam seats to students
 */
export default function AllocateExam({ onAllocate, totalAvailable, disabled }) {
  const [studentCount, setStudentCount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const count = parseInt(studentCount, 10);
    
    if (isNaN(count) || count <= 0) {
      setError("Please enter a valid number of students");
      return;
    }

    if (count > totalAvailable) {
      setError(`Not enough seats. Maximum available: ${totalAvailable}`);
      return;
    }

    onAllocate(count);
    setStudentCount("");
    setError("");
  };

  return (
    <div className="section-card animate-fade-in">
      <h2 className="section-title">
        <Users className="w-5 h-5 text-primary" />
        Allocate Exam Seats
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="studentCount" className="form-label">
              Number of Students
            </label>
            <input
              type="number"
              id="studentCount"
              value={studentCount}
              onChange={(e) => {
                setStudentCount(e.target.value);
                setError("");
              }}
              placeholder="e.g., 100"
              min="1"
              className="form-input"
              disabled={disabled}
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className="btn-success w-full sm:w-auto"
              disabled={disabled || !studentCount}
            >
              <Zap className="w-4 h-4" />
              Allocate
            </button>
          </div>
        </div>

        {/* Available seats display */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
          <div className={`w-3 h-3 rounded-full ${totalAvailable > 0 ? 'bg-success' : 'bg-destructive'}`} />
          <div className="text-sm">
            <span className="text-muted-foreground">Available seats: </span>
            <span className={`font-bold mono ${totalAvailable > 0 ? "text-success" : "text-destructive"}`}>
              {totalAvailable}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-destructive animate-scale-in">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Help text */}
        {disabled && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            Add classrooms first to allocate seats.
          </p>
        )}
      </form>
    </div>
  );
}
