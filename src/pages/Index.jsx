import { useState } from "react";
import { GraduationCap, Sparkles, RotateCcw } from "lucide-react";
import AddClassroom from "../components/AddClassroom";
import ClassroomList from "../components/ClassroomList";
import AllocateExam from "../components/AllocateExam";
import OutputPanel from "../components/OutputPanel";
import { allocateExamSeats } from "../utils/allocateExam";

/**
 * Main page for the College Exam Seat Planner application
 */
export default function Index() {
  // State for classrooms
  const [classrooms, setClassrooms] = useState([]);
  
  // State for allocation history
  const [allocationHistory, setAllocationHistory] = useState([]);

  // Calculate total available seats
  const totalAvailable = classrooms.reduce(
    (sum, room) => sum + (room.capacity - room.usedSeats),
    0
  );

  // Handler for adding a new classroom
  const handleAddClassroom = (newClassroom) => {
    setClassrooms(prev => [...prev, newClassroom]);
  };

  // Handler for deleting a classroom
  const handleDeleteClassroom = (roomId) => {
    setClassrooms(prev => prev.filter(room => room.roomId !== roomId));
  };

  // Handler for allocating seats
  const handleAllocate = (studentCount) => {
    const result = allocateExamSeats(classrooms, studentCount);
    
    // Update classrooms with new seat allocations
    if (result.success) {
      setClassrooms(result.classrooms);
    }

    // Add to allocation history (newest first)
    setAllocationHistory(prev => [
      {
        ...result,
        timestamp: Date.now()
      },
      ...prev
    ]);
  };

  // Handler for clearing allocation history
  const handleClearHistory = () => {
    setAllocationHistory([]);
  };

  // Handler for resetting all classrooms (clearing used seats)
  const handleResetSeats = () => {
    setClassrooms(prev => prev.map(room => ({ ...room, usedSeats: 0 })));
    setAllocationHistory([]);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-bar sticky top-0 z-10 backdrop-blur-sm bg-card/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                   style={{ background: 'var(--gradient-primary)' }}>
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  College Exam Seat Planner
                </h1>
                <p className="text-sm text-muted-foreground">
                  Smart seat allocation system
                </p>
              </div>
            </div>
            
            {classrooms.length > 0 && (
              <button
                onClick={handleResetSeats}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset All</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Add Classroom Form */}
        <AddClassroom
          onAddClassroom={handleAddClassroom}
          existingRoomIds={classrooms.map(r => r.roomId)}
        />

        {/* Classroom List */}
        <ClassroomList
          classrooms={classrooms}
          onDeleteClassroom={handleDeleteClassroom}
        />

        {/* Two-column layout for Allocate and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Allocate Exam Seats */}
          <AllocateExam
            onAllocate={handleAllocate}
            totalAvailable={totalAvailable}
            disabled={classrooms.length === 0}
          />

          {/* Allocation Results */}
          <OutputPanel
            allocationHistory={allocationHistory}
            onClearHistory={handleClearHistory}
          />
        </div>

        {/* Info Banner */}
        <div className="info-banner animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">
              Smart Allocation Algorithm
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Seats are allocated using a greedy approach: <strong>lower floors are preferred</strong>,
              partially-used rooms are <strong>filled first</strong> to minimize classroom usage,
              and <strong>capacity limits are never exceeded</strong>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            College Exam Seat Planner • Built with React + Vite
          </p>
        </div>
      </footer>
    </div>
  );
}
