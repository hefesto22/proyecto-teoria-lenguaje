import { router, usePage, Link } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Categoria {
    id: number;
    nombre: string;
    activa: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props extends InertiaPageProps {
    categorias: {
        data: Categoria[];
        current_page: number;
        last_page: number;
        links: PaginationLink[];
    };
    filters: {
        search?: string;
    };
    [key: string]: unknown; // ✅ para que sea compatible con Inertia
}

export default function Index() {
    const { categorias, filters } = usePage<Props>().props;

    const [search, setSearch] = useState(filters.search || "");

    const handleFilter = () => {
        router.get(route("categorias.index"), { search }, { preserveState: true, replace: true });
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
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/categorias/${id}`, {
                    onSuccess: () =>
                        Swal.fire("Eliminado", "La categoría ha sido eliminada correctamente.", "success"),
                });
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Categorías" />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Categorías</h2>
                        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-3 py-2 border rounded-md text-sm"
                            />
                            <button
                                onClick={handleFilter}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
                            >
                                🔍 Buscar
                            </button>
                            <button
                                onClick={() => router.get("/categorias/create")}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow"
                            >
                                ➕ Agregar
                            </button>
                        </div>
                    </div>

                    <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="p-3 text-left text-sm font-semibold border-b">ID</th>
                                <th className="p-3 text-left text-sm font-semibold border-b">Nombre</th>
                                <th className="p-3 text-left text-sm font-semibold border-b">Estado</th>
                                <th className="p-3 text-left text-sm font-semibold border-b">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categorias.data.map((categoria) => (
                                <tr key={categoria.id} className="hover:bg-gray-50 transition">
                                    <td className="p-3 text-sm text-gray-800">{categoria.id}</td>
                                    <td className="p-3 text-sm text-gray-800">{categoria.nombre}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`font-semibold ${categoria.activa ? "text-green-600" : "text-red-600"}`}>
                                            {categoria.activa ? "Activa" : "Inactiva"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm flex gap-2">
                                        <button
                                            onClick={() => router.get(`/categorias/${categoria.id}/edit`)}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-1 rounded-lg shadow"
                                        >
                                            📝
                                        </button>
                                        <button
                                            onClick={() => handleDelete(categoria.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    {categorias.links.length > 3 && (
                        <div className="flex flex-wrap justify-center mt-6 gap-2">
                            {categorias.links.map((link, index) => (
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
