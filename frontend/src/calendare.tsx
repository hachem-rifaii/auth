import { useEffect, useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useAppContext } from "./context/AppContext";
import axiosInstance from "./utils/axiosInstance";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

const DemoApp = () => {
  const { events, fetchEvents } = useAppContext();
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    color: "",
    date: "",
  });
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const { user } = useAppContext();
  const [filter, setFilter] = useState({ color: "", title: "", date: "" });

  const handleClose = useCallback((e: any) => {
    if (e.target.id === "close") {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (arg: any) => {
    setNewEvent({ ...newEvent, date: arg.dateStr });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (eventIdToDelete) {
        await axiosInstance.put(`/api/events/${eventIdToDelete}`, {
          title: newEvent.title,
          description: newEvent.description,
          start: new Date(newEvent.date).toISOString(),
          color: newEvent.color || "#FF5733",
        });
        toast.success("Event updated successfully");
      } else {
        await axiosInstance.post("/api/events", {
          title: newEvent.title,
          description: newEvent.description,
          start: new Date(newEvent.date).toISOString(),
          color: newEvent.color || "#FF5733",
          createdBy: user?._id,
        });
        toast.success("Event created successfully");
      }
      fetchEvents();
      setOpen(false);
    } catch (err) {
      toast.error("Error processing event");
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    setNewEvent({
      title: event.title,
      description: event.extendedProps.description,
      color: event.backgroundColor || "#FF5733",
      date: event.startStr,
    });
    setOpen(true);
    setEventIdToDelete(event.id);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/events/${eventIdToDelete}`);
      toast.success("Event deleted successfully");
      fetchEvents();
      setOpen(false);
    } catch (err) {
      toast.error("Error deleting event");
    }
  };

  const memoizedEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            (filter.color ? event.color === filter.color : true) &&
            (filter.title
              ? event.title.toLowerCase().includes(filter.title.toLowerCase())
              : true) &&
            (filter.date
              ? new Date(event.start).toISOString().slice(0, 10) === filter.date
              : true)
        )
        .map((event) => ({
          id: event._id,
          title: event.title,
          start: new Date(event.start),
          backgroundColor: event.color,
          color: event.color,
          allDay: false,
          extendedProps: { description: event.description },
        })),
    [events, filter]
  );

  return (
    <div className="w-full h-full">
      <div className="flex w-full justify-start items-center flex-col gap-4">
        <h1 className="text-3xl  ">Hiii {user?.name} 👋</h1>
        <h1 className="text-2xl  text-blue-600 font-bold">Event Calendar</h1>
      </div>
      <div className="relative p-5 w-full h-full flex">
        {/* Filter Panel */}
        <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-bold mb-3">Filter Events</h2>
          <label className="block mb-2">Color</label>
          <select
            value={filter.color}
            onChange={(e) => setFilter({ ...filter, color: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="">All</option>
            <option value="red">Red</option>
            <option value="#33FF57">Green</option>
            <option value="#3357FF">Blue</option>
          </select>

          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={filter.title}
            onChange={(e) => setFilter({ ...filter, title: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
            placeholder="Search by title"
          />
          <label className="block mb-2">Date</label>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            className="w-full p-2 mb-4 border rounded"
          />
        </div>

        {/* Calendar Section */}
        <div className="w-[70%] mx-auto bg-transparent p-3 rounded-lg shadow-2xl backdrop-blur-sm">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            events={memoizedEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => {
              const { title, backgroundColor } = eventInfo.event;
              return (
                <div
                  style={{
                    backgroundColor: backgroundColor,
                    padding: "12px",
                    borderRadius: "12px",
                    color: "white",
                    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                  className="hover:scale-105 cursor-pointer"
                >
                  {title}
                </div>
              );
            }}
          />
        </div>

        {open && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)]"
            id="close"
            onClick={handleClose}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-700 p-6 rounded-lg shadow-2xl w-96 transform scale-105 transition-transform backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-white mb-4 text-center">
                Event
              </h2>
              <label className="block text-sm font-medium text-gray-200">
                Event Title
              </label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="border-2 border-transparent p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-md"
              />
              <label className="block text-sm font-medium text-gray-200">
                Event Color
              </label>
              <select
                className="border-2 border-transparent p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-md"
                value={newEvent.color}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, color: e.target.value })
                }
              >
                <option value="">Select Color</option>
                <option value="red">Red</option>
                <option value="#33FF57">Green</option>
                <option value="#3357FF">Blue</option>
              </select>
              <label className="block text-sm font-medium text-gray-200">
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="border-2 border-transparent p-3 rounded w-full mb-4 focus:outline-none focus:ring-2 focus:ring-white backdrop-blur-md"
              />
              <p className="text-sm text-gray-300 mb-4">
                Date: {newEvent.date}
              </p>
              <button
                onClick={handleSubmit}
                className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700 transition-colors"
              >
                Save Event
              </button>

              {eventIdToDelete && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded w-full mt-4 hover:bg-red-600 transition-colors"
                >
                  <FaTrashAlt className="inline mr-2" /> Delete Event
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoApp;
