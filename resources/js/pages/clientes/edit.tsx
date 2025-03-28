import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Cliente {
    id: number;
    DNI: string;
    RTN: string;
    NOMBRES: string;
    APELLIDOS: string;
    DIRECCION: string;
    GENERO: string;
    FECHA_NAC: string;
    ACTIVO: boolean;
}

interface Props extends InertiaPageProps {
    cliente: Cliente;
}

export default function Edit({ cliente }: Props) {
    const [form, setForm] = useState({
        DNI: cliente.DNI,
        RTN: cliente.RTN,
        NOMBRES: cliente.NOMBRES,
        APELLIDOS: cliente.APELLIDOS,
        DIRECCION: cliente.DIRECCION,
        GENERO: cliente.GENERO,
        FECHA_NAC: cliente.FECHA_NAC,
        ACTIVO: cliente.ACTIVO,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setForm({ ...form, [name]: e.target.checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        router.put(`/clientes/${cliente.id}`, form, {
            preserveScroll: true,
            onError: (err) => setErrors(err),
        });
    };

    return (
        <AppLayout>
            <Head title={`Editar cliente: ${cliente.NOMBRES} ${cliente.APELLIDOS}`} />
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Editar cliente</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">DNI</label>
                        <input
                            type="text"
                            name="DNI"
                            value={form.DNI}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.DNI && <p className="text-red-500 text-sm">{errors.DNI}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">RTN</label>
                        <input
                            type="text"
                            name="RTN"
                            value={form.RTN}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.RTN && <p className="text-red-500 text-sm">{errors.RTN}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nombres</label>
                        <input
                            type="text"
                            name="NOMBRES"
                            value={form.NOMBRES}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.NOMBRES && <p className="text-red-500 text-sm">{errors.NOMBRES}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Apellidos</label>
                        <input
                            type="text"
                            name="APELLIDOS"
                            value={form.APELLIDOS}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.APELLIDOS && <p className="text-red-500 text-sm">{errors.APELLIDOS}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Dirección</label>
                        <input
                            type="text"
                            name="DIRECCION"
                            value={form.DIRECCION}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.DIRECCION && <p className="text-red-500 text-sm">{errors.DIRECCION}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Género</label>
                        <select
                            name="GENERO"
                            value={form.GENERO}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        >
                            <option value="HOMBRE">HOMBRE</option>
                            <option value="MUJER">MUJER</option>
                        </select>
                        {errors.GENERO && <p className="text-red-500 text-sm">{errors.GENERO}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Fecha de nacimiento</label>
                        <input
                            type="date"
                            name="FECHA_NAC"
                            value={form.FECHA_NAC}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.FECHA_NAC && <p className="text-red-500 text-sm">{errors.FECHA_NAC}</p>}
                    </div>

                   <div className="flex items-center gap-2">
    <input
        type="checkbox"
        name="ACTIVO"
        checked={form.ACTIVO}
        onChange={handleChange}
    />
    <label>Activo</label>
    {/* Campo oculto que envía "false" si el checkbox no está marcado */}
    <input type="hidden" name="ACTIVO" value={form.ACTIVO ? '1' : '0'} />
</div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
