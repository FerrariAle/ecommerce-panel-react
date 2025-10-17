import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

const fetchOrders = async (token) => {
    const response = await fetch('https://dummyjson.com/carts', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Falha ao buscar pedidos.");
    return response.json();
}

export default function OrdersPage() {
    const [viewingOrder, setViewingOrder] = useState(null);
    const { token } = useAuth();

    const { data, status, error } = useQuery({
        queryKey: ['orders', token],
        queryFn: () => fetchOrders(token),
        enabled: !!token,
    });

    if (status === 'pending') return <p>Carregando pedidos...</p>
    if (status === 'error') return <p className="text-red-500">Erro: {error.message}</p>

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Pedidos</h1>

            <div className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-zinc-200">
                                <th className="p-4 font-semibold">ID do Pedido</th>
                                <th className="p-4 font-semibold">Cliente ID</th>
                                <th className="p-4 font-semibold">Total de Produtos</th>
                                <th className="p-4 font-semibold">Valor Total</th>
                                <th className="p-4 font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.carts?.map(order => (
                                <tr key={order.id} className="border-b border-zinc-200 last:border-b-0">
                                    <td className="p-4 font-semibold text-zinc-800">#{order.id}</td>
                                    <td className="p-4 text-zinc-600">{order.userId}</td>
                                    <td className="p-4 text-zinc-600">{order.totalProducts}</td>
                                    <td className="p-4 text-zinc-800">R$ {order.total.toLocaleString('pt-BR')}</td>
                                    <td className="p-4">
                                        {/* Raciocínio (Ação): Clicar aqui define o estado 'viewingOrder',
                        o que fará com que o Modal seja renderizado. */}
                                        <button
                                            onClick={() => setViewingOrder(order)}
                                            className="font-semibold text-primary-800 hover:underline text-sm"
                                        >
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Raciocínio (Modal): O modal é renderizado aqui. Sua visibilidade é
          controlada pelo 'viewingOrder' (isOpen={!!viewingOrder}).
          Quando o usuário fecha, 'setViewingOrder(null)' é chamado. */}
            <Modal
                isOpen={!!viewingOrder}
                onClose={() => setViewingOrder(null)}
                title={`Detalhes do Pedido #${viewingOrder?.id}`}
            >
                {/* Raciocínio: Passamos o JSX dos detalhes como 'children' para o modal. */}
                {viewingOrder && (
                    <div className="space-y-4">
                        {viewingOrder.products.map(product => (
                            <div key={product.id} className="flex justify-between items-center bg-zinc-50 p-3 rounded-lg">
                                <p className="font-semibold">{product.title} (x{product.quantity})</p>
                                <p className="text-zinc-700">R$ {product.total.toLocaleString('pt-BR')}</p>
                            </div>
                        ))}
                        <div className="text-right font-bold text-lg mt-4 border-t pt-4">
                            Total: R$ {viewingOrder.total.toLocaleString('pt-BR')}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}