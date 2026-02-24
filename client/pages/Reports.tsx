import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface EmployeePerformance {
  name: string;
  completed: number;
  pending: number;
  inProgress: number;
  completionRate: number;
}

interface WeeklyData {
  week: string;
  completed: number;
  pending: number;
}

const mockPerformanceData: EmployeePerformance[] = [
  {
    name: "John Doe",
    completed: 5,
    pending: 2,
    inProgress: 1,
    completionRate: 62.5,
  },
  {
    name: "Sarah Johnson",
    completed: 10,
    pending: 1,
    inProgress: 1,
    completionRate: 83.3,
  },
  {
    name: "Mike Chen",
    completed: 3,
    pending: 2,
    inProgress: 1,
    completionRate: 50,
  },
  {
    name: "Alex Kumar",
    completed: 8,
    pending: 1,
    inProgress: 1,
    completionRate: 80,
  },
  {
    name: "Emma Wilson",
    completed: 6,
    pending: 1,
    inProgress: 0,
    completionRate: 85.7,
  },
];

const mockWeeklyData: WeeklyData[] = [
  { week: "Week 1", completed: 12, pending: 8 },
  { week: "Week 2", completed: 15, pending: 6 },
  { week: "Week 3", completed: 18, pending: 5 },
  { week: "Week 4", completed: 20, pending: 4 },
];

const mockTaskStatusData = [
  { name: "Completed", value: 65, color: "#10b981" },
  { name: "In Progress", value: 20, color: "#3b82f6" },
  { name: "Pending", value: 15, color: "#f59e0b" },
];

const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

export default function Reports() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const handleExportPDF = () => {
    alert(
      `Exporting ${reportType} report for ${selectedPeriod} period...`
    );
  };

  const handleExportCSV = () => {
    alert(`Exporting performance data as CSV...`);
  };

  const totalTasks = mockPerformanceData.reduce(
    (sum, emp) => sum + emp.completed + emp.pending + emp.inProgress,
    0
  );
  const completedTasks = mockPerformanceData.reduce(
    (sum, emp) => sum + emp.completed,
    0
  );
  const avgCompletionRate =
    Math.round(
      mockPerformanceData.reduce((sum, emp) => sum + emp.completionRate, 0) /
        mockPerformanceData.length
    ) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportCSV}
              size="sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={handleExportPDF}
              size="sm"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Controls */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Report Type
                </label>
                <Select
                  value={reportType}
                  onValueChange={(value: any) => setReportType(value)}
                >
                  <SelectTrigger className="w-48 mt-2 bg-white border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Report</SelectItem>
                    <SelectItem value="monthly">Monthly Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Period
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48 mt-2 bg-white border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Period</SelectItem>
                    <SelectItem value="previous">Previous Period</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Tasks",
              value: totalTasks,
              icon: "📊",
            },
            {
              label: "Completed",
              value: completedTasks,
              icon: "✅",
            },
            {
              label: "Avg Completion Rate",
              value: `${avgCompletionRate}%`,
              icon: "📈",
            },
            {
              label: "Team Members",
              value: mockPerformanceData.length,
              icon: "👥",
            },
          ].map((stat, idx) => (
            <Card key={idx} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <span className="text-4xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Task Status Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockTaskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockTaskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Progress Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockWeeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Completed"
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Pending"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Employee Performance Comparison */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle>Employee Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mockPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Completion Rates */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Employee Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPerformanceData.map((emp) => (
                <div key={emp.name} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{emp.name}</p>
                      <Badge
                        className={
                          emp.completionRate >= 80
                            ? "bg-green-100 text-green-700"
                            : emp.completionRate >= 60
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {emp.completionRate.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${emp.completionRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground w-24 text-right">
                    {emp.completed}/{emp.completed + emp.pending + emp.inProgress} tasks
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
