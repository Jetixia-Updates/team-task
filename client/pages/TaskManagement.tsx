import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  MoreVertical,
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

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
];

const employees = ["John Doe", "Sarah Johnson", "Mike Chen", "Alex Kumar", "Emma Wilson"];

export default function TaskManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Task["status"] | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    assignedTo: string;
    deadline: string;
    priority: Task["priority"];
  }>({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "medium",
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        deadline: task.deadline,
        priority: task.priority,
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        deadline: "",
        priority: "medium",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveTask = () => {
    if (!formData.title || !formData.assignedTo || !formData.deadline) {
      alert(t("taskManagement.fillRequired"));
      return;
    }

    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                ...formData,
                status: t.status,
              }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTasks([newTask, ...tasks]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm(t("taskManagement.confirmDeleteTask"))) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
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
        return <CheckCircle2 className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

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
            <h1 className="text-2xl font-bold">{t("taskManagement.title")}</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="w-4 h-4" />
                {t("taskManagement.createTask")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingTask ? t("taskManagement.editTask") : t("taskManagement.createNewTask")}</DialogTitle>
                <DialogDescription>
                  {editingTask
                    ? t("taskManagement.editTaskDesc")
                    : t("taskManagement.createTaskDesc")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">{t("taskManagement.taskTitle")}</Label>
                  <Input
                    id="title"
                    placeholder={t("taskManagement.taskTitlePlaceholder")}
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t("taskManagement.description")}</Label>
                  <Textarea
                    id="description"
                    placeholder={t("taskManagement.descriptionPlaceholder")}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-2"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignedTo">{t("taskManagement.assignTo")}</Label>
                    <Select value={formData.assignedTo} onValueChange={(value) =>
                      setFormData({ ...formData, assignedTo: value })
                    }>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t("taskManagement.selectEmployee")} />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp} value={emp}>
                            {emp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">{t("taskManagement.priority")}</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: any) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t("common.low")}</SelectItem>
                        <SelectItem value="medium">{t("common.medium")}</SelectItem>
                        <SelectItem value="high">{t("common.high")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">{t("taskManagement.deadline")}</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={handleSaveTask}
                  >
                    {editingTask ? t("taskManagement.updateTask") : t("taskManagement.createTask")}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3 top-3 rtl:left-auto rtl:right-3 text-muted-foreground" />
            <Input
              placeholder={t("taskManagement.searchTasks")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rtl:pl-0 rtl:pr-10 bg-white border-border"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "in-progress", "completed"] as const).map(
              (status) => (
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
              )
            )}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">{t("taskManagement.noTasks")}</p>
                </CardContent>
              </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="border-0 shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground">
                            {task.title}
                          </h4>
                          <p className="text-muted-foreground text-sm mt-1">
                            {task.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge
                              className={`${getPriorityColor(task.priority)} border`}
                            >
                              {t(`common.${task.priority}`)} {t("common.priority")}
                            </Badge>
                            <Badge variant="outline">{task.assignedTo}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-sm text-muted-foreground">
                        {t("common.due")}: {new Date(task.deadline).toLocaleDateString()}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(task)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                            {t("taskManagement.editTask")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            {t("taskManagement.markInProgress")}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            {t("taskManagement.markCompleted")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTask(task.id)}
                            className="gap-2 cursor-pointer text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t("taskManagement.deleteTask")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
