import  {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "../utils/axiosInstance";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Event {
  _id: string;
  title: string;
  start: string;
  startDate: Date;
  description?: string;
  color?: string;
}

interface AppContextType {
  user: User | null;
  events: Event[];
  fetchUser: () => Promise<void>;
  fetchEvents: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);


  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/users/me",{
        headers : {
          Authorization : `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      console.error("Failed to fetch user:", err);
    }
  };
  
  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/api/events", {
        headers : {
          Authorization : `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      setEvents(res.data.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };
  

  useEffect(() => {
    fetchUser();
    fetchEvents();
  }, []);

  return (
    <AppContext.Provider value={{ user, events, fetchUser, fetchEvents }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
