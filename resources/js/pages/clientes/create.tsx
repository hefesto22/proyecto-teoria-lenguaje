import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import type { BreadcrumbItem } from "@/types";

interface Props extends InertiaPageProps {
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Clientes", href: "/clientes" },
    { title: "Crear", href: "#" },
];

export default function Create({}: Props) {
    const { data, setData, post, processing, errors } = useForm({
        dni: "",
        rtn: "",
        nombres: "",
        apellidos: "",
        direccion: "",
        genero: "",
        fecha_nac: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("clientes.store"));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Cliente" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white border rounded-xl shadow p-6 max-w-xl mx-auto w-full">
                    <h1 className="text-2xl font-bold mb-4">Crear Cliente</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* DNI */}
                        <div>
                            <label htmlFor="dni" className="block text-sm font-medium">DNI</label>
                            <input
                                id="dni"
                                type="text"
                                value={data.dni}
                                onChange={(e) => setData("dni", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
                        </div>

                        {/* RTN */}
                        <div>
                            <label htmlFor="rtn" className="block text-sm font-medium">RTN</label>
                            <input
                                id="rtn"
                                type="text"
                                value={data.rtn}
                                onChange={(e) => setData("rtn", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.rtn && <p className="text-red-500 text-sm">{errors.rtn}</p>}
                        </div>

                        {/* Nombres */}
                        <div>
                            <label htmlFor="nombres" className="block text-sm font-medium">Nombres</label>
                            <input
                                id="nombres"
                                type="text"
                                value={data.nombres}
                                onChange={(e) => setData("nombres", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres}</p>}
                        </div>

                        {/* Apellidos */}
                        <div>
                            <label htmlFor="apellidos" className="block text-sm font-medium">Apellidos</label>
                            <input
                                id="apellidos"
                                type="text"
                                value={data.apellidos}
                                onChange={(e) => setData("apellidos", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos}</p>}
                        </div>

                        {/* Dirección */}
                        <div>
                            <label htmlFor="direccion" className="block text-sm font-medium">Dirección</label>
                            <input
                                id="direccion"
                                type="text"
                                value={data.direccion}
                                onChange={(e) => setData("direccion", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
                        </div>

                        {/* Género */}
                        <div>
                            <label htmlFor="genero" className="block text-sm font-medium">Género</label>
                            <select
                                id="genero"
                                value={data.genero}
                                onChange={(e) => setData("genero", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            >
                                <option value="">Seleccionar Género</option>
                                <option value="HOMBRE">Masculino</option>
                                <option value="MUJER">Femenino</option>
                            </select>
                            {errors.genero && <p className="text-red-500 text-sm">{errors.genero}</p>}
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                            <label htmlFor="fecha_nac" className="block text-sm font-medium">Fecha de Nacimiento</label>
                            <input
                                id="fecha_nac"
                                type="date"
                                value={data.fecha_nac}
                                onChange={(e) => setData("fecha_nac", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.fecha_nac && <p className="text-red-500 text-sm">{errors.fecha_nac}</p>}
                        </div>

                        {/* Botón */}
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
