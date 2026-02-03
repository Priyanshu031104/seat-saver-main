import { useState } from "react";
import { Plus, Building2 } from "lucide-react";
import { validateClassroom } from "../utils/allocateExam";

/**
 * Form component for adding new classrooms to the system
 */
export default function AddClassroom({ onAddClassroom, existingRoomIds }) {
  const [formData, setFormData] = useState({
    roomId: "",
    capacity: "",
    floorNo: "",
    nearWashroom: false
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create classroom object
    const newClassroom = {
      roomId: formData.roomId.trim().toUpperCase(),
      capacity: parseInt(formData.capacity, 10),
      floorNo: parseInt(formData.floorNo, 10),
      nearWashroom: formData.nearWashroom,
      usedSeats: 0
    };

    // Validate
    const validation = validateClassroom(newClassroom);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    // Check for duplicate room ID
    if (existingRoomIds.includes(newClassroom.roomId)) {
      setError("A classroom with this Room ID already exists");
      return;
    }

    // Add classroom
    onAddClassroom(newClassroom);

    // Reset form
    setFormData({
      roomId: "",
      capacity: "",
      floorNo: "",
      nearWashroom: false
    });
  };

  return (
    <div className="section-card animate-fade-in">
      <h2 className="section-title">
        <Building2 className="w-5 h-5 text-primary" />
        Add Classroom
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Room ID */}
          <div>
            <label htmlFor="roomId" className="form-label">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              placeholder="e.g., A101"
              className="form-input"
              required
            />
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="form-label">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 60"
              min="1"
              className="form-input"
              required
            />
          </div>

          {/* Floor Number */}
          <div>
            <label htmlFor="floorNo" className="form-label">
              Floor Number
            </label>
            <input
              type="number"
              id="floorNo"
              name="floorNo"
              value={formData.floorNo}
              onChange={handleChange}
              placeholder="e.g., 1"
              min="0"
              className="form-input"
              required
            />
          </div>

          {/* Near Washroom */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  name="nearWashroom"
                  checked={formData.nearWashroom}
                  onChange={handleChange}
                  className="form-checkbox"
                />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                Near Washroom
              </span>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message text-sm animate-scale-in">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Classroom
        </button>
      </form>
    </div>
  );
}
