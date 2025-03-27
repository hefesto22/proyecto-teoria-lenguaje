import { usePage, Link } from '@inertiajs/react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import {
    User,
    UserCog,
    LayoutGrid,
    ShoppingBasket,
    Album,
    ChartBarStacked,
} from 'lucide-react';
import AppLogo from './app-logo';

interface AuthUser {
    id: number;
    role: 'admin' | 'gerente' | 'usuario';
}

export function AppSidebar() {
    const { authUser } = usePage<{ authUser?: AuthUser | null }>().props;

    if (authUser === undefined) {
        return <div className="text-center text-gray-500">Cargando menú...</div>;
    }

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    switch (authUser?.role) {
        case 'admin':
            mainNavItems.push(
                { title: 'Usuarios', href: '/users', icon: UserCog },
                { title: 'Clientes', href: '/clientes', icon: User },
                { title: 'Categorias', href: '/categorias', icon: Album },
                { title: 'Productos', href: '/productos', icon: ShoppingBasket },
                { title: 'Facturación', href: '/facturacion', icon: Album },
            );
            break;
        case 'gerente':
            mainNavItems.push(
                { title: 'Clientes', href: '/clientes', icon: User },
                { title: 'Categorias', href: '/categorias', icon: Album },
                { title: 'Productos', href: '/productos', icon: ShoppingBasket },
                { title: 'Facturación', href: '/facturacion', icon: Album },
            );
            break;
        case 'usuario':
        default:
            // Solo dashboard, nada que agregar
            break;
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
