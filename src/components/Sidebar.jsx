import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white flex-shrink-0 p-6 flex flex-col border-r border-zinc-200">
            <h1 className="text-2xl font-bold text-primary-900 mb-10">
                E-Panel
            </h1>
            <nav className="flex flex-col gap-4">
                <NavLink to="/dashboard" className="font-semibold text-zinc-600 hover:text-primary-900">
                    Dashboard
                </NavLink>
                <NavLink to="/products" className="font-semibold text-zinc-600 hover:text-primary-900">
                    Produtos
                </NavLink>
                <NavLink to="/orders" className="font-semibold text-zinc-600 hover:text-primary-900">
                    Pedidos
                </NavLink>
            </nav>
            <div className="mt-auto">
                <p className="text-sm text-zinc-500">Usuário Deslogado</p>
            </div>
        </aside>
    )
}