import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Categoria {
    id: number;
    nombre: string;
}

interface Imagen {
    id: number;
    path: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    categoria_id: number;
    activo: boolean;
    imagenes: Imagen[];
}

interface Props extends InertiaPageProps {
    producto: Producto;
    categorias: Categoria[];
}

export default function Edit({ producto, categorias }: Props) {
    const [form, setForm] = useState({
        nombre: producto.nombre,
        precio: String(producto.precio),
        stock: String(producto.stock),
        categoria_id: producto.categoria_id,
        activo: producto.activo,
        imagenes: [] as File[],
    });

    const [preview, setPreview] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox" && e.target instanceof HTMLInputElement) {
            setForm({ ...form, [name]: e.target.checked });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setForm({ ...form, imagenes: files });
            setPreview(files.map((file) => URL.createObjectURL(file)));
        }
    };

    const handleImageDelete = (id: number) => {
        Swal.fire({
            title: "¿Eliminar imagen?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar",
        }).then((res) => {
            if (res.isConfirmed) {
                router.delete(`/imagenes/${id}`, {
                    preserveScroll: true,
                });
            }
        });
    };

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();

    formData.append("_method", "PUT"); // 👈 ¡IMPORTANTE!
    formData.append("nombre", form.nombre);
    formData.append("precio", form.precio);
    formData.append("stock", form.stock);
    formData.append("categoria_id", String(form.categoria_id));
    formData.append("activo", form.activo ? "1" : "0");

    form.imagenes.forEach((img, i) => {
        formData.append(`imagenes[${i}]`, img);
    });

    router.post(`/productos/${producto.id}`, formData, {
        forceFormData: true,
        preserveScroll: true,
        onError: (err) => setErrors(err),
    });
};


    return (
        <AppLayout>
            <Head title={`Editar producto: ${producto.nombre}`} />
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
                <h1 className="text-2xl font-bold mb-4">Editar producto</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        />
                        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Precio</label>
                            <input
                                type="number"
                                name="precio"
                                step="0.01"
                                value={form.precio}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.precio && <p className="text-red-500 text-sm">{errors.precio}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Categoría</label>
                        <select
                            name="categoria_id"
                            value={form.categoria_id}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 mt-1"
                        >
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.categoria_id && <p className="text-red-500 text-sm">{errors.categoria_id}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="activo"
                            checked={form.activo}
                            onChange={handleChange}
                        />
                        <label>Activo</label>
                    </div>

                    {/* Imágenes existentes */}
                    {producto.imagenes.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Imágenes actuales</label>
                            <div className="flex flex-wrap gap-4">
                                {producto.imagenes.map((img) => (
                                    <div key={img.id} className="relative w-24 h-24">
                                        <img
                                            src={`/storage/${img.path}`}
                                            alt=""
                                            className="w-full h-full object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleImageDelete(img.id)}
                                            className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2 py-0.5"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium">Agregar nuevas imágenes</label>
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                        {preview.length > 0 && (
                            <div className="flex flex-wrap gap-4 mt-4">
                                {preview.map((url, i) => (
                                    <div key={i} className="w-24 h-24 relative">
                                        <img
                                            src={url}
                                            alt=""
                                            className="w-full h-full object-cover rounded border"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
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
