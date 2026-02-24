import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  LogOut,
  Menu,
  Search,
  AlertCircle,
  FileUp,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  assignedBy: string;
  attachments: number;
  comments: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete Project Report",
    description: "Finish the Q1 project report with all metrics and analysis",
    deadline: "2024-02-28",
    priority: "high",
    status: "in-progress",
    assignedBy: "Sarah Johnson",
    attachments: 2,
    comments: 3,
  },
  {
    id: "2",
    title: "Review Client Proposal",
    description: "Review and provide feedback on the new client proposal",
    deadline: "2024-02-25",
    priority: "high",
    status: "pending",
    assignedBy: "Mike Chen",
    attachments: 1,
    comments: 0,
  },
  {
    id: "3",
    title: "Update Documentation",
    description: "Update API documentation with latest endpoints",
    deadline: "2024-03-05",
    priority: "medium",
    status: "pending",
    assignedBy: "Sarah Johnson",
    attachments: 0,
    comments: 2,
  },
  {
    id: "4",
    title: "Team Meeting Preparation",
    description: "Prepare slides for the weekly team meeting",
    deadline: "2024-02-23",
    priority: "low",
    status: "completed",
    assignedBy: "John Doe",
    attachments: 3,
    comments: 1,
  },
  {
    id: "5",
    title: "Database Optimization",
    description: "Optimize database queries for improved performance",
    deadline: "2024-03-10",
    priority: "medium",
    status: "pending",
    assignedBy: "Alex Kumar",
    attachments: 2,
    comments: 5,
  },
];

export default function EmployeeDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Task["status"] | "all">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "pending":
        return "text-orange-600";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "in-progress":
        return <Clock className="w-5 h-5" />;
      case "pending":
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const isDeadlineSoon = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days <= 3 && days > 0;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <img
                src="/Adsolution logotrans.png"
                alt="Adsolution"
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-xl font-bold hidden sm:block">{t("dashboard.employee.title")}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-slate-100 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t("dashboard.employee.searchTasks")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-0 focus:ring-0 w-32"
              />
            </div>

            <LanguageSwitcher />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow">
                  {user.name.charAt(0).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t("common.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t("dashboard.employee.welcome", { name: user.name })}
          </h2>
          <p className="text-muted-foreground">{t("dashboard.employee.subtitle")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t("dashboard.employee.totalTasks"),
              value: taskStats.total,
              icon: "📋",
              color: "from-blue-100 to-blue-50",
            },
            {
              label: t("dashboard.employee.inProgress"),
              value: taskStats.inProgress,
              icon: "⚡",
              color: "from-amber-100 to-amber-50",
            },
            {
              label: t("dashboard.employee.pending"),
              value: taskStats.pending,
              icon: "⏳",
              color: "from-orange-100 to-orange-50",
            },
            {
              label: t("dashboard.employee.completed"),
              value: taskStats.completed,
              icon: "✅",
              color: "from-green-100 to-green-50",
            },
          ].map((stat, idx) => (
            <Card key={idx} className="border-0 shadow-sm bg-gradient-to-br" style={{
              backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <span className="text-4xl">{stat.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Task List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h3 className="text-2xl font-bold">{t("dashboard.employee.myTasks")}</h3>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {(["all", "pending", "in-progress", "completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filterStatus === status
                      ? "bg-primary text-white shadow-lg"
                      : "bg-white border border-border text-foreground hover:border-primary"
                  }`}
                >
                  {status === "all"
                    ? t("common.all")
                    : t(`common.${status === "in-progress" ? "inProgress" : status}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">{t("dashboard.employee.noTasks")}</p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {task.title}
                            </h4>
                            <p className="text-muted-foreground text-sm mt-1">
                              {task.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge
                                variant="secondary"
                                className={`${getPriorityColor(task.priority)} border`}
                              >
                                {t(`common.${task.priority}`)} {t("common.priority")}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {task.status === "in-progress"
                                  ? t("common.inProgress")
                                  : t(`common.${task.status}`)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-3">
                        <div className="flex items-center space-x-3 text-sm">
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span
                              className={
                                isDeadlineSoon(task.deadline)
                                  ? "text-red-600 font-semibold"
                                  : ""
                              }
                            >
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          {isDeadlineSoon(task.deadline) && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              {t("common.dueSoon")}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {t("common.assignedBy")} {task.assignedBy}
                        </div>

                        {(task.attachments > 0 || task.comments > 0) && (
                          <div className="flex gap-4 pt-2">
                            {task.attachments > 0 && (
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <FileUp className="w-4 h-4" />
                                <span>{task.attachments}</span>
                              </div>
                            )}
                            {task.comments > 0 && (
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span>{task.comments}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
