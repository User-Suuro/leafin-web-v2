"use client";

import { authClient } from "@/lib/auth-utils/auth-client";
import { useEffect, useState } from "react";
import { DatagridColumn, DatagridView } from "@/components/dgv/datagrid-view";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
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
        setUsers(response.data.users as unknown as User[]);

        setTotalItems(response.data.users.length);
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
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchQuery]);

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
      header: "Joined",
      accessorKey: "createdAt",
      cell: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (user) => (
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        User Management
      </h1>
      <DatagridView
        data={users}
        columns={columns}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearchQuery}
        loading={loading}
        action={<Button>Create User</Button>}
      />
    </div>
  );
}
