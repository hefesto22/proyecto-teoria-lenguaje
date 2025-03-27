import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import type { BreadcrumbItem } from "@/types";

interface Props extends InertiaPageProps {
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Categorías", href: "/categorias" },
    { title: "Crear", href: "#" },
];

export default function Create({}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("categorias.store"));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Categoría" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white border rounded-xl shadow p-6 max-w-xl mx-auto w-full">
                    <h1 className="text-2xl font-bold mb-4">Crear Categoría</h1>
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
                                placeholder="Ej: Ropa, Bebidas, Electrónica"
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
