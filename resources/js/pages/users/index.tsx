import { router, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import Swal, { SweetAlertResult } from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props extends InertiaPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        links: PaginationLink[];
    };
    filters: {
        search?: string;
        role?: string;
    };
    roles: Role[];
    [key: string]: unknown;
}

export default function Index() {
    const { users, filters, roles } = usePage<Props>().props;

    const [search, setSearch] = useState(filters.search || "");
    const [role, setRole] = useState(filters.role || "");

    const handleFilter = () => {
        router.get(route("users.index"), { search, role }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
        }).then((result: SweetAlertResult) => {
            if (result.isConfirmed) {
                router.delete(`/users/${id}`, {
                    onSuccess: () =>
                        Swal.fire("Eliminado", "El usuario ha sido eliminado correctamente.", "success"),
                });
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Usuarios" />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Usuarios</h2>
                        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o correo"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            />
                            <select
                                aria-label="Filtrar por rol"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            >
                                <option value="">Todos los roles</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.name}>
                                        {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleFilter}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
                            >
                                🔍 Buscar
                            </button>
                            <button
                                onClick={() => router.get("/users/create")}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
                            >
                                ➕ Agregar
                            </button>
                        </div>
                    </div>

                    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                        <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="p-3 text-left text-sm font-semibold border-b">ID</th>
                                    <th className="p-3 text-left text-sm font-semibold border-b">Nombre</th>
                                    <th className="p-3 text-left text-sm font-semibold border-b">Correo</th>
                                    <th className="p-3 text-left text-sm font-semibold border-b">Rol</th>
                                    <th className="p-3 text-left text-sm font-semibold border-b">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition">
                                        <td className="p-3 text-sm text-gray-800">{user.id}</td>
                                        <td className="p-3 text-sm text-gray-800">{user.name}</td>
                                        <td className="p-3 text-sm text-gray-800">{user.email}</td>
                                        <td className="p-3 text-sm text-gray-800 capitalize">{user.role?.name}</td>
                                        <td className="p-3 text-sm flex gap-2">
                                            <button
                                                onClick={() => router.get(`/users/${user.id}/edit`)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded-lg shadow"
                                            >
                                                📝
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.links.length > 3 && (
                        <div className="flex flex-wrap justify-center mt-6 gap-2">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || ""}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-4 py-2 text-sm rounded-lg shadow transition ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-blue-100"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
