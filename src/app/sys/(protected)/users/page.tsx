"use client";

import { authClient } from "@/lib/auth-utils/auth-client";
import { useCallback, useEffect, useState } from "react";
import { DatagridColumn, DatagridView } from "@/components/dgv/datagrid-view";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BanIcon, Pencil, Trash2, Undo2 } from "lucide-react";
import { ROLES } from "@/lib/auth-utils/permissions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddUserModal from "@/components/pages/sys/modal/AddUserModal";

interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
  banned?: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/helpers/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleBan = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/helpers/ban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to ban user");
      }

      toast.success("User banned successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const response = await fetch("/api/admin/helpers/unban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to unban user");
      }

      toast.success("User unbanned successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await authClient.admin.listUsers({
        query: {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
          searchField: "email", // or "name" or generic search if supported by API/custom implementation
          searchOperator: "contains",
          searchValue: searchQuery,
        },
      });

      if (response.data) {
        let fetchedUsers = response.data.users as unknown as User[];



        console.log("Fetched users:", fetchedUsers);

        if (session?.user?.role !== ROLES.SUPERADMIN) {
          fetchedUsers = fetchedUsers.filter(
            (user) => user.role !== ROLES.SUPERADMIN
          );
        }

        setUsers(fetchedUsers);

        setTotalItems(fetchedUsers.length);
      }

      if (response.error) {
        toast.error(response.error.message || "Failed to fetch users");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, session?.user?.role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const canBan = (targetUser: User) => {
    if (!session?.user) return false;
    // Cannot ban self
    if (targetUser.id === session.user.id) return false;
    // Cannot ban super admin
    if (targetUser.role === ROLES.SUPERADMIN) return false;
    return true;
  };

  const columns: DatagridColumn<User>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user) => <span className="capitalize">{user.role || "user"}</span>,
    },
    {
      header: "Verified",
      accessorKey: "emailVerified",
      cell: (user) => (user.emailVerified ? "Yes" : "No"),
    },
    {
      header: "Status",
      accessorKey: "banned",
      cell: (user) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${user.banned
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
            }`}
        >
          {user.banned ? "Banned" : "Active"}
        </span>
      ),
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (user) => {
        if (!canBan(user)) return null;
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                        handleDelete(user.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete User</p>
                </TooltipContent>
              </Tooltip>

              {user.banned ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="text-green-600 hover:text-green-700 hover:bg-green-100"
                      onClick={() => {
                        if (confirm(`Are you sure you want to unban ${user.email}?`)) {
                          handleUnban(user.id);
                        }
                      }}
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unban User</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                      onClick={() => {
                        // Simple confirmation for now, or could be a modal
                        if (confirm(`Are you sure you want to ban ${user.email}?`)) {
                          handleBan(user.id);
                        }
                      }}
                    >
                      <BanIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ban User</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  // Filter out columns that should create empty cells if the entire column ends up empty for current view
  // Specifically for Actions column
  const filteredColumns = columns.filter((col) => {
    if (col.header === "Actions") {
      // Check if any user in the current page can be banned
      const hasAnyActions = users.some((user) => canBan(user));
      return hasAnyActions;
    }
    return true;
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        User Management
      </h1>
      <DatagridView
        data={users}
        columns={filteredColumns}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearchQuery}
        onReload={fetchUsers}
        loading={loading}
        action={
          <Button onClick={() => setIsAddUserModalOpen(true)}>
            Create User
          </Button>
        }
      />

      <AddUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
