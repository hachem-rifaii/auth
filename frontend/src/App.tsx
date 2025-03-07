import "./index.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DemoApp from "./calendare";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
      
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<DemoApp />} />
          </Route>
          
        </Routes>
      </Router>
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
