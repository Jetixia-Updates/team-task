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
import {
  Plus,
  Search,
  MoreVertical,
  ArrowLeft,
  Edit2,
  Trash2,
  Mail,
  Briefcase,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: string;
  status: "active" | "inactive";
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "Developer",
    department: "Engineering",
    joinDate: "2023-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Project Manager",
    department: "Management",
    joinDate: "2022-06-20",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@company.com",
    role: "Designer",
    department: "Design",
    joinDate: "2023-03-10",
    status: "active",
  },
  {
    id: "4",
    name: "Alex Kumar",
    email: "alex@company.com",
    role: "Developer",
    department: "Engineering",
    joinDate: "2022-11-05",
    status: "active",
  },
  {
    id: "5",
    name: "Emma Wilson",
    email: "emma@company.com",
    role: "QA Engineer",
    department: "Quality Assurance",
    joinDate: "2023-02-14",
    status: "active",
  },
];

const roles = ["Developer", "Project Manager", "Designer", "QA Engineer", "HR Manager"];
const departments = ["Engineering", "Design", "Management", "Quality Assurance", "Human Resources"];

const roleKeys: Record<string, string> = {
  Developer: "developer",
  "Project Manager": "projectManager",
  Designer: "designer",
  "QA Engineer": "qaEngineer",
  "HR Manager": "hrManager",
};
const departmentKeys: Record<string, string> = {
  Engineering: "engineering",
  Design: "design",
  Management: "management",
  "Quality Assurance": "qualityAssurance",
  "Human Resources": "humanResources",
};

export default function EmployeeManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    joinDate: "",
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "all" || emp.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        joinDate: employee.joinDate,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        email: "",
        role: "",
        department: "",
        joinDate: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveEmployee = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      !formData.department ||
      !formData.joinDate
    ) {
      alert(t("employeeManagement.fillRequired"));
      return;
    }

    if (editingEmployee) {
      setEmployees(
        employees.map((e) =>
          e.id === editingEmployee.id
            ? {
                ...e,
                ...formData,
                status: e.status,
              }
            : e
        )
      );
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
      };
      setEmployees([newEmployee, ...employees]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm(t("employeeManagement.confirmDeleteEmployee"))) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setEmployees(
      employees.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "active" ? "inactive" : "active" }
          : e
      )
    );
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
            <h1 className="text-2xl font-bold">{t("employeeManagement.title")}</h1>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="w-4 h-4" />
                {t("employeeManagement.addEmployee")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? t("employeeManagement.editEmployee") : t("employeeManagement.addNewEmployee")}
                </DialogTitle>
                <DialogDescription>
                  {editingEmployee
                    ? t("employeeManagement.editEmployeeDesc")
                    : t("employeeManagement.addEmployeeDesc")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t("employeeManagement.fullName")}</Label>
                  <Input
                    id="name"
                    placeholder={t("employeeManagement.fullNamePlaceholder")}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t("employeeManagement.emailAddress")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("employeeManagement.emailPlaceholder")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">{t("employeeManagement.role")}</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t("employeeManagement.selectRole")} />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r} value={r}>
                            {t(`employeeManagement.roles.${roleKeys[r] || r}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">{t("employeeManagement.department")}</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) =>
                        setFormData({ ...formData, department: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder={t("employeeManagement.selectDepartment")} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((d) => (
                          <SelectItem key={d} value={d}>
                            {t(`employeeManagement.departments.${departmentKeys[d] || d}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="joinDate">{t("employeeManagement.joinDate")}</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) =>
                      setFormData({ ...formData, joinDate: e.target.value })
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
                    onClick={handleSaveEmployee}
                  >
                    {editingEmployee ? t("employeeManagement.updateEmployee") : t("employeeManagement.addEmployee")}
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
              placeholder={t("employeeManagement.searchEmployees")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rtl:pl-0 rtl:pr-10 bg-white border-border"
            />
          </div>

          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-border">
              <SelectValue placeholder={t("employeeManagement.filterByDepartment")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("employeeManagement.allDepartments")}</SelectItem>
              {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {t(`employeeManagement.departments.${departmentKeys[d] || d}`)}
              </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEmployees.length === 0 ? (
            <Card className="border-0 shadow-sm col-span-full">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg">{t("employeeManagement.noEmployees")}</p>
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Mail className="w-4 h-4" />
                          {employee.email}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleOpenDialog(employee)}
                          className="gap-2 cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                          {t("employeeManagement.editEmployee")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(employee.id)}
                          className="gap-2 cursor-pointer"
                        >
                          {employee.status === "active"
                            ? t("employeeManagement.deactivate")
                            : t("employeeManagement.activate")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="gap-2 cursor-pointer text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          {t("employeeManagement.deleteEmployee")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground font-medium">
                          {t("common.role")}
                        </p>
                        <p className="font-semibold text-foreground mt-1">
                          {t(`employeeManagement.roles.${roleKeys[employee.role] || employee.role}`)}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground font-medium">
                          {t("common.department")}
                        </p>
                        <p className="font-semibold text-foreground mt-1">
                          {t(`employeeManagement.departments.${departmentKeys[employee.department] || employee.department}`)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground font-medium">
                          {t("common.joinDate")}
                        </p>
                        <p className="font-semibold text-foreground mt-1">
                          {new Date(employee.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground font-medium">
                          {t("common.status")}
                        </p>
                        <Badge
                          className={`mt-1 ${
                            employee.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t(`common.${employee.status}`)}
                        </Badge>
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
  );
}
