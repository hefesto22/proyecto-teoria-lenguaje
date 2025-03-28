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
        DNI: "",
        RTN: "",
        NOMBRES: "",
        APELLIDOS: "",
        DIRECCION: "",
        GENERO: "",
        FECHA_NAC: "",
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
                        <div>
                            <label htmlFor="DNI" className="block text-sm font-medium">
                                DNI
                            </label>
                            <input
                                id="DNI"
                                type="text"
                                value={data.DNI}
                                onChange={(e) => setData("DNI", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.DNI && <p className="text-red-500 text-sm">{errors.DNI}</p>}
                        </div>

                        <div>
                            <label htmlFor="RTN" className="block text-sm font-medium">
                                RTN
                            </label>
                            <input
                                id="RTN"
                                type="text"
                                value={data.RTN}
                                onChange={(e) => setData("RTN", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.RTN && <p className="text-red-500 text-sm">{errors.RTN}</p>}
                        </div>

                        <div>
                            <label htmlFor="NOMBRES" className="block text-sm font-medium">
                                Nombres
                            </label>
                            <input
                                id="NOMBRES"
                                type="text"
                                value={data.NOMBRES}
                                onChange={(e) => setData("NOMBRES", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.NOMBRES && <p className="text-red-500 text-sm">{errors.NOMBRES}</p>}
                        </div>

                        <div>
                            <label htmlFor="APELLIDOS" className="block text-sm font-medium">
                                Apellidos
                            </label>
                            <input
                                id="APELLIDOS"
                                type="text"
                                value={data.APELLIDOS}
                                onChange={(e) => setData("APELLIDOS", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.APELLIDOS && <p className="text-red-500 text-sm">{errors.APELLIDOS}</p>}
                        </div>

                        <div>
                            <label htmlFor="DIRECCION" className="block text-sm font-medium">
                                Dirección
                            </label>
                            <input
                                id="DIRECCION"
                                type="text"
                                value={data.DIRECCION}
                                onChange={(e) => setData("DIRECCION", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.DIRECCION && <p className="text-red-500 text-sm">{errors.DIRECCION}</p>}
                        </div>

                      <div>
    <label htmlFor="GENERO" className="block text-sm font-medium">
        Género
    </label>
    <select
        id="GENERO"
        value={data.GENERO}
        onChange={(e) => setData("GENERO", e.target.value)}
        className="w-full border rounded px-3 py-2 mt-1"
    >
        <option value="">Seleccionar Género</option>
        <option value="MUJER">Masculino</option>
        <option value="HOMBRE">Femenino</option>

    </select>
    {errors.GENERO && <p className="text-red-500 text-sm">{errors.GENERO}</p>}
</div>

                        <div>
                            <label htmlFor="FECHA_NAC" className="block text-sm font-medium">
                                Fecha de Nacimiento
                            </label>
                            <input
                                id="FECHA_NAC"
                                type="date"
                                value={data.FECHA_NAC}
                                onChange={(e) => setData("FECHA_NAC", e.target.value)}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.FECHA_NAC && <p className="text-red-500 text-sm">{errors.FECHA_NAC}</p>}
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
