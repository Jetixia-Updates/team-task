import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Share2, Scale, Search, Users, ListTodo } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  createdAt: string;
}

interface EmployeeWorkload {
  name: string;
  taskCount: number;
  pendingCount: number;
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete Project Report",
    description: "Finish the Q1 project report with all metrics",
    assignedTo: "John Doe",
    deadline: "2024-02-28",
    priority: "high",
    status: "in-progress",
    createdAt: "2024-02-15",
  },
  {
    id: "2",
    title: "Review Client Proposal",
    description: "Review and provide feedback on proposal",
    assignedTo: "Sarah Johnson",
    deadline: "2024-02-25",
    priority: "high",
    status: "pending",
    createdAt: "2024-02-14",
  },
  {
    id: "3",
    title: "Update Documentation",
    description: "Update API documentation",
    assignedTo: "Mike Chen",
    deadline: "2024-03-05",
    priority: "medium",
    status: "pending",
    createdAt: "2024-02-13",
  },
  {
    id: "4",
    title: "Team Meeting Preparation",
    description: "Prepare slides for the weekly team meeting",
    assignedTo: "",
    deadline: "2024-02-23",
    priority: "low",
    status: "pending",
    createdAt: "2024-02-12",
  },
  {
    id: "5",
    title: "Database Optimization",
    description: "Optimize database queries for improved performance",
    assignedTo: "",
    deadline: "2024-03-10",
    priority: "medium",
    status: "pending",
    createdAt: "2024-02-11",
  },
];

const employeeNames = ["John Doe", "Sarah Johnson", "Mike Chen", "Alex Kumar", "Emma Wilson"];

function getTaskCountByEmployee(tasks: Task[]): Record<string, { total: number; pending: number }> {
  const counts: Record<string, { total: number; pending: number }> = {};
  employeeNames.forEach((name) => {
    counts[name] = { total: 0, pending: 0 };
  });
  tasks.forEach((task) => {
    if (task.assignedTo && counts[task.assignedTo]) {
      counts[task.assignedTo].total += 1;
      if (task.status === "pending") counts[task.assignedTo].pending += 1;
    }
  });
  return counts;
}

export default function TaskDistribution() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [assignToEmployee, setAssignToEmployee] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Task["status"] | "all" | "unassigned">("all");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const workload = getTaskCountByEmployee(tasks);
  const employeesWithWorkload: EmployeeWorkload[] = employeeNames.map((name) => ({
    name,
    taskCount: workload[name].total,
    pendingCount: workload[name].pending,
  }));

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "unassigned" ? !task.assignedTo : task.status === filterStatus);
    return matchesSearch && matchesStatus;
  });

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending" || !t.assignedTo);
  const unassignedTasks = tasks.filter((t) => !t.assignedTo);
  const selectableTasks = filteredTasks.filter((t) => t.status !== "completed");

  const handleToggleTask = (taskId: string) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(new Set(selectableTasks.map((t) => t.id)));
    } else {
      setSelectedTaskIds(new Set());
    }
  };

  const handleAssignSelected = () => {
    if (!assignToEmployee || selectedTaskIds.size === 0) return;
    setTasks((prev) =>
      prev.map((task) =>
        selectedTaskIds.has(task.id) ? { ...task, assignedTo: assignToEmployee } : task
      )
    );
    setSelectedTaskIds(new Set());
    setAssignToEmployee("");
  };

  const handleDistributeEvenly = () => {
    if (unassignedTasks.length === 0) return;
    const sorted = [...employeesWithWorkload].sort((a, b) => a.taskCount - b.taskCount);
    const updated = [...tasks];
    unassignedTasks.forEach((task, index) => {
      const employee = sorted[index % sorted.length].name;
      const idx = updated.findIndex((t) => t.id === task.id);
      if (idx !== -1) updated[idx] = { ...updated[idx], assignedTo: employee };
    });
    setTasks(updated);
    setSelectedTaskIds(new Set());
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">{t("taskDistribution.title")}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions card */}
        <Card className="border-0 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              {t("taskDistribution.actions")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="flex flex-1 min-w-[200px] items-center gap-2">
              <Select value={assignToEmployee} onValueChange={setAssignToEmployee}>
                <SelectTrigger className="bg-white border-border">
                  <SelectValue placeholder={t("taskDistribution.assignSelectedTo")} />
                </SelectTrigger>
                <SelectContent>
                  {employeeNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name} ({workload[name].total} {t("common.tasks")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="shrink-0"
                onClick={handleAssignSelected}
                disabled={!assignToEmployee || selectedTaskIds.size === 0}
              >
                {t("taskDistribution.assign")} ({selectedTaskIds.size})
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleDistributeEvenly}
              disabled={unassignedTasks.length === 0}
              className="gap-2"
            >
              <Scale className="w-4 h-4" />
              {t("taskDistribution.distributeEvenly")} ({unassignedTasks.length})
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                {t("taskDistribution.tasksToDistribute")}
              </h2>
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none min-w-[160px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 text-muted-foreground" />
                  <Input
                    placeholder={t("common.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 rtl:pl-0 rtl:pr-9 bg-white border-border"
                  />
                </div>
                <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                  <SelectTrigger className="w-[140px] bg-white border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="unassigned">{t("taskDistribution.unassigned")}</SelectItem>
                    <SelectItem value="pending">{t("common.pending")}</SelectItem>
                    <SelectItem value="in-progress">{t("common.inProgress")}</SelectItem>
                    <SelectItem value="completed">{t("common.completed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="p-3 border-b border-border flex items-center gap-2">
                  <Checkbox
                    checked={
                      selectableTasks.length > 0 &&
                      selectableTasks.every((t) => selectedTaskIds.has(t.id))
                    }
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {t("taskDistribution.selectAll")} ({filteredTasks.length})
                  </span>
                </div>
                <div className="max-h-[480px] overflow-y-auto">
                  {filteredTasks.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      {t("taskDistribution.noTasksToShow")}
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 ${
                          selectedTaskIds.has(task.id) ? "bg-primary/5" : ""
                        }`}
                      >
                        <Checkbox
                          checked={selectedTaskIds.has(task.id)}
                          onCheckedChange={() => handleToggleTask(task.id)}
                          disabled={task.status === "completed"}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">{task.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {task.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs border ${getPriorityColor(task.priority)}`}
                            >
                              {t(`common.${task.priority}`)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.status === "in-progress"
                                ? t("common.inProgress")
                                : t(`common.${task.status}`)}
                            </Badge>
                            {task.assignedTo && (
                              <span className="text-xs text-muted-foreground">
                                → {task.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employees workload */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t("taskDistribution.teamWorkload")}
            </h2>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-3">
                {employeesWithWorkload.map((emp) => (
                  <div
                    key={emp.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {emp.taskCount} {t("common.tasks")} · {emp.pendingCount} {t("common.pending")}
                      </p>
                    </div>
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (emp.taskCount / Math.max(...employeesWithWorkload.map((e) => e.taskCount), 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
