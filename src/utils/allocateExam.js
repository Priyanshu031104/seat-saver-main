/**
 * Allocates exam seats using a greedy approach.
 * 
 * Allocation Rules:
 * 1. Prefer classrooms on lower floors first
 * 2. Fill remaining seats in already-used classrooms before using new ones
 * 3. Use minimum number of classrooms
 * 4. Do not exceed room capacity
 * 
 * @param {Array} classrooms - Array of classroom objects
 * @param {number} studentsToAllocate - Number of students to allocate
 * @returns {Object} Result containing success status, allocations, and updated classrooms
 */
export function allocateExamSeats(classrooms, studentsToAllocate) {
  // Validate input
  if (!classrooms || classrooms.length === 0) {
    return {
      success: false,
      error: "No classrooms available",
      allocations: [],
      classrooms: classrooms || []
    };
  }

  if (studentsToAllocate <= 0) {
    return {
      success: false,
      error: "Please enter a valid number of students",
      allocations: [],
      classrooms
    };
  }

  // Calculate total available seats
  const totalAvailable = classrooms.reduce(
    (sum, room) => sum + (room.capacity - room.usedSeats),
    0
  );

  if (totalAvailable < studentsToAllocate) {
    return {
      success: false,
      error: `Not enough seats available. Requested: ${studentsToAllocate}, Available: ${totalAvailable}`,
      allocations: [],
      classrooms
    };
  }

  // Create a deep copy of classrooms to avoid mutation
  const updatedClassrooms = classrooms.map(room => ({ ...room }));

  // Separate classrooms into partially used and empty
  const partiallyUsed = updatedClassrooms
    .filter(room => room.usedSeats > 0 && room.usedSeats < room.capacity)
    .sort((a, b) => {
      // Sort by floor (ascending), then by remaining capacity (descending)
      if (a.floorNo !== b.floorNo) return a.floorNo - b.floorNo;
      return (b.capacity - b.usedSeats) - (a.capacity - a.usedSeats);
    });

  const emptyRooms = updatedClassrooms
    .filter(room => room.usedSeats === 0)
    .sort((a, b) => {
      // Sort by floor (ascending), then by capacity (descending)
      if (a.floorNo !== b.floorNo) return a.floorNo - b.floorNo;
      return b.capacity - a.capacity;
    });

  // Priority: Fill partially used rooms first, then empty rooms
  const sortedRooms = [...partiallyUsed, ...emptyRooms];

  const allocations = [];
  let remainingStudents = studentsToAllocate;

  // Greedy allocation
  for (const room of sortedRooms) {
    if (remainingStudents <= 0) break;

    const availableInRoom = room.capacity - room.usedSeats;
    if (availableInRoom <= 0) continue;

    // Allocate as many students as possible to this room
    const seatsToAllocate = Math.min(availableInRoom, remainingStudents);
    
    // Find the room in updated classrooms and update it
    const roomIndex = updatedClassrooms.findIndex(r => r.roomId === room.roomId);
    if (roomIndex !== -1) {
      updatedClassrooms[roomIndex].usedSeats += seatsToAllocate;
    }

    allocations.push({
      roomId: room.roomId,
      floorNo: room.floorNo,
      seatsAllocated: seatsToAllocate,
      previousUsed: room.usedSeats,
      newUsed: room.usedSeats + seatsToAllocate,
      capacity: room.capacity
    });

    remainingStudents -= seatsToAllocate;
  }

  return {
    success: true,
    totalRequested: studentsToAllocate,
    totalAllocated: studentsToAllocate - remainingStudents,
    allocations,
    classrooms: updatedClassrooms
  };
}

/**
 * Validates classroom data
 * @param {Object} classroom - Classroom object to validate
 * @returns {Object} Validation result with isValid flag and error message
 */
export function validateClassroom(classroom) {
  if (!classroom.roomId || classroom.roomId.trim() === "") {
    return { isValid: false, error: "Room ID is required" };
  }

  if (!classroom.capacity || classroom.capacity <= 0) {
    return { isValid: false, error: "Capacity must be a positive number" };
  }

  if (classroom.floorNo === undefined || classroom.floorNo < 0) {
    return { isValid: false, error: "Floor number must be 0 or greater" };
  }

  return { isValid: true };
}
