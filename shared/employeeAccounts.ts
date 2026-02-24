/**
 * Employee login accounts (username + password) for employee login.
 * Stored in localStorage on the client.
 */

export interface EmployeeLoginAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  password: string;
}

export const EMPLOYEE_ACCOUNTS_KEY = "employeeLoginAccounts";

export function getEmployeeAccounts(): EmployeeLoginAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EMPLOYEE_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setEmployeeAccounts(accounts: EmployeeLoginAccount[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(EMPLOYEE_ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function findAccountByUsername(
  username: string,
  password: string
): EmployeeLoginAccount | undefined {
  const accounts = getEmployeeAccounts();
  return accounts.find(
    (a) => a.username === username && a.password === password
  );
}
