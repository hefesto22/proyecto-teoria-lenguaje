import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Cliente {
    id: number;
    dni: string;
    rtn: string;
    nombres: string;
    apellidos: string;
    direccion: string;
    genero: string;
    fecha_nac: string;
    activo: boolean;
}

interface Props extends InertiaPageProps {
    cliente: Cliente;
}

export default function Edit({ cliente }: Props) {
    const [form, setForm] = useState({
        dni: cliente.dni,
        rtn: cliente.rtn,
        nombres: cliente.nombres,
        apellidos: cliente.apellidos,
        direccion: cliente.direccion,
        genero: cliente.genero,
        fecha_nac: cliente.fecha_nac,
        activo: cliente.activo,
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
            onSuccess: () =>
                Swal.fire("Éxito", "Cliente actualizado correctamente", "success"),
        });
    };

    return (
        <AppLayout>
            <Head title={`Editar cliente: ${cliente.nombres} ${cliente.apellidos}`} />
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Editar cliente</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* DNI */}
                    <div>
                        <label className="block text-sm font-medium">DNI</label>
                        <input
                            type="text"
                            name="dni"
                            value={form.dni}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
                    </div>

                    {/* RTN */}
                    <div>
                        <label className="block text-sm font-medium">RTN</label>
                        <input
                            type="text"
                            name="rtn"
                            value={form.rtn}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.rtn && <p className="text-red-500 text-sm">{errors.rtn}</p>}
                    </div>

                    {/* Nombres */}
                    <div>
                        <label className="block text-sm font-medium">Nombres</label>
                        <input
                            type="text"
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres}</p>}
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label className="block text-sm font-medium">Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos}</p>}
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
                    </div>

                    {/* Género */}
                    <div>
                        <label className="block text-sm font-medium">Género</label>
                        <select
                            name="genero"
                            value={form.genero}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        >
                            <option value="HOMBRE">Masculino</option>
                            <option value="MUJER">Femenino</option>
                        </select>
                        {errors.genero && <p className="text-red-500 text-sm">{errors.genero}</p>}
                    </div>

                    {/* Fecha de nacimiento */}
                    <div>
                        <label className="block text-sm font-medium">Fecha de nacimiento</label>
                        <input
                            type="date"
                            name="fecha_nac"
                            value={form.fecha_nac}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.fecha_nac && <p className="text-red-500 text-sm">{errors.fecha_nac}</p>}
                    </div>

                    {/* Activo */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="activo"
                            checked={form.activo}
                            onChange={handleChange}
                        />
                        <label>Activo</label>
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
