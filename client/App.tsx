import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TaskManagement from "./pages/TaskManagement";
import TaskDistribution from "./pages/TaskDistribution";
import EmployeeManagement from "./pages/EmployeeManagement";
import EmployeeAccounts from "./pages/EmployeeAccounts";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<EmployeeDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/tasks" element={<TaskManagement />} />
      <Route path="/admin/distribute" element={<TaskDistribution />} />
      <Route path="/admin/employees" element={<EmployeeManagement />} />
      <Route path="/admin/accounts" element={<EmployeeAccounts />} />
      <Route path="/admin/reports" element={<Reports />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
