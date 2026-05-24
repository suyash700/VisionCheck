import { Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import Calibration from "./pages/Calibration";
import Home from "./pages/Home";
import NumberTest from "./pages/NumberTest";
import Result from "./pages/Result";
import TracingTest from "./pages/TracingTest";

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calibration" element={<Calibration />} />
          <Route path="/number-test" element={<NumberTest />} />
          <Route path="/tracing-test" element={<TracingTest />} />
          <Route path="/result" element={<Result />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
