import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import type { BreadcrumbItem } from "@/types";

interface Categoria {
    id: number;
    nombre: string;
    activa: boolean;
}

interface Props extends InertiaPageProps {
    categoria: Categoria;
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Categorías", href: "/categorias" },
    { title: "Editar", href: "#" },
];

export default function Edit({ categoria }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: categoria.nombre,
        activa: categoria.activa,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("categorias.update", categoria.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Categoría" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white border rounded-xl shadow p-6 max-w-xl mx-auto w-full">
                    <h1 className="text-2xl font-bold mb-4">Editar Categoría</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium">
                                Nombre
                            </label>
                            <input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData("nombre", e.target.value)}
                                placeholder="Nombre de la categoría"
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="activa"
                                type="checkbox"
                                checked={data.activa}
                                onChange={(e) => setData("activa", e.target.checked)}
                            />
                            <label htmlFor="activa" className="text-sm font-medium">
                                ¿Activa?
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
