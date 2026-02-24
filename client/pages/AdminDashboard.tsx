import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Users,
  LogOut,
  Menu,
  Search,
  Plus,
  MoreVertical,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  BarChart3,
  ListTodo,
  FileText,
  ArrowRight,
  Share2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  taskCount: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionRate: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "Developer",
    taskCount: 8,
    completedTasks: 5,
    pendingTasks: 2,
    inProgressTasks: 1,
    completionRate: 62.5,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Project Manager",
    taskCount: 12,
    completedTasks: 10,
    pendingTasks: 1,
    inProgressTasks: 1,
    completionRate: 83.3,
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@company.com",
    role: "Designer",
    taskCount: 6,
    completedTasks: 3,
    pendingTasks: 2,
    inProgressTasks: 1,
    completionRate: 50,
  },
  {
    id: "4",
    name: "Alex Kumar",
    email: "alex@company.com",
    role: "Developer",
    taskCount: 10,
    completedTasks: 8,
    pendingTasks: 1,
    inProgressTasks: 1,
    completionRate: 80,
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma@company.com",
    role: "QA Engineer",
    taskCount: 7,
    completedTasks: 6,
    pendingTasks: 1,
    inProgressTasks: 0,
    completionRate: 85.7,
  },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    setUser(userData);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredEmployees = employees.filter((emp) => {
    return (
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const stats = {
    totalEmployees: employees.length,
    totalTasks: employees.reduce((sum, emp) => sum + emp.taskCount, 0),
    completedTasks: employees.reduce((sum, emp) => sum + emp.completedTasks, 0),
    averageCompletionRate:
      Math.round(
        employees.reduce((sum, emp) => sum + emp.completionRate, 0) /
          employees.length
      ) || 0,
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-blue-600";
    if (rate >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return t("dashboard.admin.excellent");
    if (rate >= 60) return t("dashboard.admin.good");
    if (rate >= 40) return t("dashboard.admin.fair");
    return t("dashboard.admin.needsImprovement");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
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
              <h1 className="text-xl font-bold hidden sm:block">{t("dashboard.admin.title")}</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link to="/admin/employees">
            <Button
              className="hidden sm:inline-flex gap-2 bg-primary hover:bg-primary/90"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              {t("dashboard.admin.addEmployee")}
            </Button>
          </Link>

            <LanguageSwitcher />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-gradient-to-br from-secondary to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow">
                  {user.name.charAt(0).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-3 border-b border-border">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-primary font-semibold mt-1">{t("common.admin")}</p>
                </div>
                <DropdownMenuItem className="cursor-pointer">
                  {t("common.settings")}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  {t("common.reports")}
                </DropdownMenuItem>
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
          <h2 className="text-3xl font-bold text-foreground mb-2">{t("dashboard.admin.teamOverview")}</h2>
          <p className="text-muted-foreground">{t("dashboard.admin.subtitle")}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/tasks">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ListTodo className="w-5 h-5 text-blue-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t("dashboard.admin.taskManagement")}</h3>
                <p className="text-sm text-muted-foreground">{t("dashboard.admin.taskManagementDesc")}</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/distribute">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t("dashboard.admin.taskDistribution")}</h3>
                <p className="text-sm text-muted-foreground">{t("dashboard.admin.taskDistributionDesc")}</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/employees">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t("dashboard.admin.employeeManagement")}</h3>
                <p className="text-sm text-muted-foreground">{t("dashboard.admin.employeeManagementDesc")}</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/reports">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{t("dashboard.admin.reportsAnalytics")}</h3>
                <p className="text-sm text-muted-foreground">{t("dashboard.admin.reportsAnalyticsDesc")}</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t("dashboard.admin.teamMembers"),
              value: stats.totalEmployees,
              icon: Users,
              color: "from-blue-100 to-blue-50",
            },
            {
              label: t("dashboard.admin.totalTasks"),
              value: stats.totalTasks,
              icon: BarChart3,
              color: "from-amber-100 to-amber-50",
            },
            {
              label: t("dashboard.admin.completedTasks"),
              value: stats.completedTasks,
              icon: CheckCircle2,
              color: "from-green-100 to-green-50",
            },
            {
              label: t("dashboard.admin.avgCompletion"),
              value: `${stats.averageCompletionRate}%`,
              icon: TrendingUp,
              color: "from-teal-100 to-teal-50",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Members */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h3 className="text-2xl font-bold">{t("dashboard.admin.teamMembers")}</h3>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none relative">
                <Search className="w-4 h-4 absolute left-3 top-3 rtl:left-auto rtl:right-3 text-muted-foreground" />
                <Input
                  placeholder={t("dashboard.admin.searchEmployees")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rtl:pl-0 rtl:pr-10 bg-white border-border"
                />
              </div>
              <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 sm:flex hidden">
                <Download className="w-4 h-4" />
                {t("dashboard.admin.exportReport")}
              </Button>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredEmployees.length === 0 ? (
              <Card className="border-0 shadow-sm col-span-full">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">{t("dashboard.admin.noEmployees")}</p>
                </CardContent>
              </Card>
            ) : (
              filteredEmployees.map((employee) => (
                <Card key={employee.id} className="border-0 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-lg">
                            {employee.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                          <Badge variant="secondary" className="mt-2">
                            {employee.role}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            {t("dashboard.admin.viewTasks")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            {t("dashboard.admin.assignTask")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            {t("dashboard.admin.editDetails")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Task Stats */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-muted-foreground font-medium">
                              {t("common.completed")}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {employee.completedTasks}/{employee.taskCount}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-xs text-muted-foreground font-medium">
                              {t("common.inProgress")}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {employee.inProgressTasks}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            <span className="text-xs text-muted-foreground font-medium">
                              {t("common.pending")}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-foreground">
                            {employee.pendingTasks}
                          </p>
                        </div>
                        <div className={`bg-slate-50 rounded-lg p-3 border-2 border-transparent`}>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                            <TrendingUp className={`w-4 h-4 ${getCompletionColor(
                              employee.completionRate
                            )}`} />
                            <span className="text-xs text-muted-foreground font-medium">
                              {t("dashboard.admin.performance")}
                            </span>
                          </div>
                          <p className={`text-lg font-bold ${getCompletionColor(
                            employee.completionRate
                          )}`}>
                            {employee.completionRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground">
                            {t("dashboard.admin.completionProgress")}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${
                              employee.completionRate >= 80
                                ? "bg-green-100 text-green-700"
                                : employee.completionRate >= 60
                                  ? "bg-blue-100 text-blue-700"
                                  : employee.completionRate >= 40
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                          >
                            {getPerformanceBadge(employee.completionRate)}
                          </Badge>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${employee.completionRate}%` }}
                          />
                        </div>
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
