import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import type { PageProps as InertiaPageProps } from "@inertiajs/core";
import type { BreadcrumbItem } from "@/types";

interface Role {
    id: number;
    name: string;
}

interface Props extends InertiaPageProps {
    roles: Role[];
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Usuarios", href: "/users" },
    { title: "Crear", href: "/users/create" },
];

export default function Create({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        role_id: roles[0]?.id ?? 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("users.store"));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="bg-white border relative flex-1 rounded-xl shadow p-6 max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Crear Usuario</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Ingresa el nombre"
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">Correo</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="usuario@correo.com"
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="******"
                                className="w-full border rounded px-3 py-2 mt-1"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium">Rol</label>
                            <select
                                id="role"
                                title="Selecciona un rol"
                                value={data.role_id}
                                onChange={(e) => setData("role_id", Number(e.target.value))}
                                className="w-full border rounded px-3 py-2 mt-1"
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.role_id && <p className="text-red-500 text-sm">{errors.role_id}</p>}
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
