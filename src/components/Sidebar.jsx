import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user, logout } = useAuth();

    return (
        <aside className="w-64 bg-white flex-shrink-0 p-6 flex flex-col border-r border-zinc-200">
            <h1 className="text-2xl font-bold text-primary-900 mb-10">
                E-Panel
            </h1>
            <nav className="flex flex-col gap-4">
                {user?.role === 'admin' && (
                    <>
                        <NavLink to="/dashboard" className="font-semibold text-zinc-600 hover:text-primary-900">
                            Dashboard
                        </NavLink>
                        <NavLink to="/products" className="font-semibold text-zinc-600 hover:text-primary-900">
                            Produtos
                        </NavLink>
                        <NavLink to="/orders" className="font-semibold text-zinc-600 hover:text-primary-900">
                            Pedidos
                        </NavLink>
                    </>
                )}


                {user?.role === 'sales_manager' && (
                    <>
                        <NavLink to="/dashboard" className="font-semibold text-zinc-600 hover:text-primary-900">
                            Dashboard
                        </NavLink>
                        <NavLink to="/orders" className="font-semibold text-zinc-600 hover:text-primary-900">
                            Pedidos
                        </NavLink>
                    </>
                )}

                {user?.role === 'stock_manager' && (
                    <>
                        <NavLink to="/dashboard" className="font-semibold text-zinc-600 hover:text-primary-900">
                            Dashboard
                        </NavLink>
                        <NavLink to="/products" className="font-semibold text-zinc-600 hover:text-primary-900">
                            Produtos
                        </NavLink>
                    </>
                )}
            </nav>


            <div className="mt-auto">
                {user ? (
                    <div>
                        <img src={user.image} alt="Avatar" className="w-10 h-10 rounded-full mb-2" />
                        <p className="text-sm font-bold text-zinc-800">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-zinc-500">{user.role.replace('_', ' ')}</p>
                        <button onClick={logout} className="text-sm font-semibold text-red-500 hover:underline mt-2">
                            Sair
                        </button>
                    </div>
                ) : null}
            </div>
        </aside>
    )
}