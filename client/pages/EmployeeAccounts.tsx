import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus, Search, KeyRound } from "lucide-react";
import {
  getEmployeeAccounts,
  setEmployeeAccounts,
  type EmployeeLoginAccount,
} from "@shared/employeeAccounts";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

const mockEmployees: Employee[] = [
  { id: "1", name: "John Doe", email: "john@company.com", role: "Developer", department: "Engineering" },
  { id: "2", name: "Sarah Johnson", email: "sarah@company.com", role: "Project Manager", department: "Management" },
  { id: "3", name: "Mike Chen", email: "mike@company.com", role: "Designer", department: "Design" },
  { id: "4", name: "Alex Kumar", email: "alex@company.com", role: "Developer", department: "Engineering" },
  { id: "5", name: "Emma Wilson", email: "emma@company.com", role: "QA Engineer", department: "Quality Assurance" },
];

export default function EmployeeAccounts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<EmployeeLoginAccount[]>([]);
  const [edits, setEdits] = useState<Record<string, { username: string; password: string }>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

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
    setAccounts(getEmployeeAccounts());
  }, [navigate]);

  const getAccount = (employeeId: string) =>
    accounts.find((a) => a.id === employeeId);
  const getEdit = (employeeId: string) =>
    edits[employeeId] ?? { username: getAccount(employeeId)?.username ?? "", password: "" };

  const handleSave = (emp: Employee) => {
    const edit = getEdit(emp.id);
    if (!edit.username.trim()) return;
    const newAccount: EmployeeLoginAccount = {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      username: edit.username.trim(),
      password: edit.password || getAccount(emp.id)?.password || "",
    };
    const next = accounts.filter((a) => a.id !== emp.id);
    next.push(newAccount);
    setEmployeeAccounts(next);
    setAccounts(next);
    setEdits((prev) => ({ ...prev, [emp.id]: { ...edit, password: "" } }));
    setSavedId(emp.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const filteredEmployees = mockEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold">{t("employeeAccounts.title")}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              {t("employeeAccounts.subtitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("employeeAccounts.hint")}
            </p>
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rtl:pl-0 rtl:pr-9 bg-white border-border"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredEmployees.map((emp) => {
            const account = getAccount(emp.id);
            const edit = getEdit(emp.id);
            const hasAccount = !!account;
            return (
              <Card key={emp.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{emp.name}</p>
                      <p className="text-sm text-muted-foreground">{emp.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{emp.role}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                      <div className="space-y-1">
                        <Label className="text-xs">{t("employeeAccounts.username")}</Label>
                        <Input
                          placeholder={t("employeeAccounts.usernamePlaceholder")}
                          value={edit.username}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [emp.id]: { ...getEdit(emp.id), username: e.target.value },
                            }))
                          }
                          className="h-9 bg-white border-border"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">{t("employeeAccounts.password")}</Label>
                        <Input
                          type="password"
                          placeholder={
                            hasAccount
                              ? t("employeeAccounts.passwordLeaveEmpty")
                              : t("employeeAccounts.passwordPlaceholder")
                          }
                          value={edit.password}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [emp.id]: { ...getEdit(emp.id), password: e.target.value },
                            }))
                          }
                          className="h-9 bg-white border-border"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          size="sm"
                          onClick={() => handleSave(emp)}
                          disabled={!edit.username.trim()}
                          className="gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          {savedId === emp.id ? t("employeeAccounts.saved") : t("common.save")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
