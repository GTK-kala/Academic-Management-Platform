import { useState, useEffect } from "react";
import {
  FiClock,
  FiMapPin,
  FiUsers,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiCalendar,
} from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

const Schedule = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("week"); // 'day', 'week', 'month'
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);

  // New event form
  const [eventForm, setEventForm] = useState({
    title: "",
    course_id: "",
    day_of_week: "",
    start_time: "09:00",
    end_time: "10:00",
    location: "",
    type: "lecture",
    recurring: true,
  });

  // Get week days
  const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Get month days
  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const monthDays = getMonthDays(currentDate);

  // Time slots for day/week view
  const timeSlots = Array.from(
    { length: 12 },
    (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`,
  );

  // Navigation
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() - 1);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") newDate.setDate(newDate.getDate() + 1);
    else if (viewMode === "week") newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Format helpers
  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatWeekRange = (days) => {
    const start = days[0];
    const end = days[days.length - 1];
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Mock schedule data
  const mockSchedule = [
    {
      id: 1,
      title: "CS101 - Introduction to Programming",
      day: 1,
      start: "09:00",
      end: "10:30",
      location: "Room 101",
      type: "lecture",
      course: "CS101",
    },
    {
      id: 2,
      title: "CS102 - Data Structures",
      day: 2,
      start: "11:00",
      end: "12:30",
      location: "Room 203",
      type: "lecture",
      course: "CS102",
    },
    {
      id: 3,
      title: "MATH201 - Calculus II",
      day: 3,
      start: "14:00",
      end: "15:30",
      location: "Room 305",
      type: "lecture",
      course: "MATH201",
    },
    {
      id: 4,
      title: "CS101 Lab Session",
      day: 4,
      start: "09:00",
      end: "11:00",
      location: "Lab A",
      type: "lab",
      course: "CS101",
    },
    {
      id: 5,
      title: "PHYS101 - Physics Lab",
      day: 5,
      start: "13:00",
      end: "15:00",
      location: "Lab B",
      type: "lab",
      course: "PHYS101",
    },
  ];

  const getEventsForDay = (dayIndex) => {
    return mockSchedule.filter((event) => event.day === dayIndex);
  };

  const getEventTypeStyle = (type) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200";
      case "lab":
        return "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200";
      case "tutorial":
        return "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary dark:text-white">
            Schedule
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.role === "teacher"
              ? "Manage your teaching schedule"
              : "View your class schedule"}
          </p>
        </div>
        <Button
          onClick={() => setShowAddEvent(true)}
          className="flex items-center gap-2"
        >
          <FiPlus /> Add Event
        </Button>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={navigatePrevious}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <button
              onClick={navigateToday}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Today
            </button>

            <button
              onClick={navigateNext}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white ml-2">
              {viewMode === "month"
                ? formatMonthYear(currentDate)
                : viewMode === "week"
                  ? formatWeekRange(weekDays)
                  : currentDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
            </h2>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-dark-bg rounded-lg p-1">
            {["day", "week", "month"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  viewMode === mode
                    ? "bg-white dark:bg-dark-card text-primary shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Content */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        {/* Day/Week View */}
        {(viewMode === "day" || viewMode === "week") && (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Day Headers (Week View) */}
              {viewMode === "week" && (
                <div className="grid grid-cols-8 border-b border-gray-200 dark:border-dark-border">
                  <div className="p-3 border-r border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg"></div>
                  {weekDays.map((day, idx) => (
                    <div
                      key={idx}
                      className={`p-3 text-center border-r border-gray-200 dark:border-dark-border ${
                        isToday(day)
                          ? "bg-primary-50 dark:bg-primary-900/20"
                          : ""
                      }`}
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p
                        className={`text-lg font-semibold ${
                          isToday(day)
                            ? "text-primary dark:text-primary-300"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {day.getDate()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Time Grid */}
              <div className={viewMode === "week" ? "grid grid-cols-8" : ""}>
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className={
                      viewMode === "week"
                        ? "grid grid-cols-8 border-b border-gray-100 dark:border-dark-border"
                        : "flex border-b border-gray-100 dark:border-dark-border"
                    }
                  >
                    {/* Time Label */}
                    <div className="p-3 border-r border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg flex items-center justify-center min-h-[80px]">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {time}
                      </span>
                    </div>

                    {/* Day Columns (Week View) */}
                    {viewMode === "week" ? (
                      weekDays.map((day, dayIdx) => {
                        const dayNumber = day.getDay() || 7; // Sunday = 7
                        const events = getEventsForDay(dayNumber);
                        const eventAtTime = events.find(
                          (e) => e.start === time,
                        );

                        return (
                          <div
                            key={dayIdx}
                            className={`p-2 border-r border-gray-100 dark:border-dark-border min-h-[80px] ${
                              isToday(day)
                                ? "bg-primary-50/30 dark:bg-primary-900/5"
                                : ""
                            }`}
                          >
                            {eventAtTime && (
                              <div
                                className={`p-2 rounded-lg border text-xs ${getEventTypeStyle(eventAtTime.type)}`}
                              >
                                <p className="font-medium truncate">
                                  {eventAtTime.title}
                                </p>
                                <p className="mt-1 opacity-75">
                                  {eventAtTime.start} - {eventAtTime.end}
                                </p>
                                <p className="opacity-75 flex items-center gap-1 mt-1">
                                  <FiMapPin className="w-3 h-3" />{" "}
                                  {eventAtTime.location}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      /* Day View - Single Column */
                      <div className="flex-1 p-2 min-h-[80px]">
                        {getEventsForDay(currentDate.getDay() || 7)
                          .filter((e) => e.start === time)
                          .map((event) => (
                            <div
                              key={event.id}
                              className={`p-3 rounded-lg border ${getEventTypeStyle(event.type)} mb-2`}
                            >
                              <p className="font-medium">{event.title}</p>
                              <p className="text-xs mt-1 opacity-75">
                                {event.start} - {event.end}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs opacity-75">
                                <span className="flex items-center gap-1">
                                  <FiMapPin className="w-3 h-3" />{" "}
                                  {event.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiBook className="w-3 h-3" /> {event.course}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Month View */}
        {viewMode === "month" && (
          <div>
            {/* Day Names Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-dark-border">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {monthDays.map((dayObj, idx) => {
                const dayNumber = dayObj.date.getDay();
                const events = getEventsForDay(dayNumber);

                return (
                  <div
                    key={idx}
                    className={`min-h-[100px] p-2 border-b border-r border-gray-100 dark:border-dark-border ${
                      !dayObj.isCurrentMonth
                        ? "bg-gray-50 dark:bg-dark-bg/50 opacity-50"
                        : ""
                    } ${isToday(dayObj.date) ? "bg-primary-50/30 dark:bg-primary-900/10" : ""}`}
                  >
                    <span
                      className={`text-sm ${
                        isToday(dayObj.date)
                          ? "bg-primary text-white w-7 h-7 rounded-full inline-flex items-center justify-center font-semibold"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {dayObj.date.getDate()}
                    </span>

                    {/* Events */}
                    <div className="mt-1 space-y-1">
                      {events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${getEventTypeStyle(event.type)}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{events.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Classes List */}
      <div className="mt-6 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Classes
        </h3>
        <div className="space-y-3">
          {mockSchedule.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            >
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xs text-primary dark:text-primary-300 font-medium">
                  {["", "Mon", "Tue", "Wed", "Thu", "Fri"][event.day]}
                </span>
                <span className="text-lg font-bold text-primary dark:text-white">
                  {event.start.split(":")[0]}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {event.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" /> {event.start} - {event.end}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" /> {event.location}
                  </span>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getEventTypeStyle(event.type)}`}
              >
                {event.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add Schedule Event
              </h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowAddEvent(false);
                alert("Event added successfully!");
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  placeholder="e.g., CS101 Lecture"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Day
                  </label>
                  <select
                    value={eventForm.day_of_week}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        day_of_week: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  >
                    <option value="">Select Day</option>
                    <option value="1">Monday</option>
                    <option value="2">Tuesday</option>
                    <option value="3">Wednesday</option>
                    <option value="4">Thursday</option>
                    <option value="5">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={eventForm.type}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, type: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.start_time}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, start_time: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={eventForm.end_time}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, end_time: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white"
                  placeholder="e.g., Room 101"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={eventForm.recurring}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, recurring: e.target.checked })
                  }
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Recurring weekly
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowAddEvent(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
