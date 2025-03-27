import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";
import type { BreadcrumbItem } from "@/types";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";

interface Categoria {
    id: number;
    nombre: string;
}

interface Props extends InertiaPageProps {
    categorias: Categoria[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Productos", href: "/productos" },
    { title: "Crear", href: "#" },
];

export default function Create({ categorias }: Props) {
    const [data, setData] = useState({
        nombre: "",
        precio: "",
        stock: "",
        categoria_id: categorias[0]?.id ?? 0,
        imagenes: [] as File[],
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const previews = files.map((file) => URL.createObjectURL(file));

            setData({ ...data, imagenes: files });
            setPreviewUrls(previews);
        }
    };

    const removeImage = (index: number) => {
        const updatedFiles = [...data.imagenes];
        const updatedPreviews = [...previewUrls];

        updatedFiles.splice(index, 1);
        updatedPreviews.splice(index, 1);

        setData({ ...data, imagenes: updatedFiles });
        setPreviewUrls(updatedPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append("nombre", data.nombre);
        formData.append("precio", String(data.precio));
        formData.append("stock", String(data.stock));
        formData.append("categoria_id", String(data.categoria_id));

        data.imagenes.forEach((file, i) => {
            formData.append(`imagenes[${i}]`, file);
        });

        router.post("/productos", formData, {
            forceFormData: true,
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Producto" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white border rounded-xl shadow p-6 max-w-xl mx-auto w-full">
                    <h1 className="text-2xl font-bold mb-4">Crear Producto</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Nombre</label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData({ ...data, nombre: e.target.value })}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.precio}
                                onChange={(e) => setData({ ...data, precio: e.target.value })}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.precio && <p className="text-red-500 text-sm">{errors.precio}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Stock</label>
                            <input
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData({ ...data, stock: e.target.value })}
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Categoría</label>
                            <select
                                value={data.categoria_id}
                                onChange={(e) =>
                                    setData({ ...data, categoria_id: parseInt(e.target.value, 10) })
                                }
                                className="w-full border rounded px-3 py-2 mt-1"
                            >
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.categoria_id && <p className="text-red-500 text-sm">{errors.categoria_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Imágenes</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1"
                            />
                            {errors["imagenes.0"] && (
                                <p className="text-red-500 text-sm">{errors["imagenes.0"]}</p>
                            )}

                            {previewUrls.length > 0 && (
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative w-24 h-24">
                                            <img
                                                src={url}
                                                alt={`preview-${index}`}
                                                className="w-full h-full object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2 py-0.5"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
