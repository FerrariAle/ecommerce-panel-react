import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import KPIWidget from "../components/KPIWidget";
import SalesChart from "../components/SalesChart";

const fetchSalesData = async (token) => {
    const response = await fetch('https://dummyjson.com/carts', {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Falha ao buscar dados de vendas.");
    return response.json();
}

export default function DashboardPage() {
    const { user, token } = useAuth();

    const canViewSales = user?.role === 'admin' || user?.role === 'sales_manager';

    const { data: salesData, status: salesStatus, error: salesError } = useQuery({
        queryKey: ['sales', token],
        queryFn: () => fetchSalesData(token),
        enabled: !!token && canViewSales,
        refetchInterval: 30000,
    });

    const totalRevenue = salesData?.carts?.reduce((sum, cart) => sum + cart.total, 0) || 0;
    const totalOrders = salesData?.total || 0;

    if (salesStatus === 'pending' && canViewSales) {
        return <p>Carregando dashboard...</p>
    }

    if (salesStatus === 'error') {
        return <p className="text-red-500">Erro: {salesError.message}</p>
    }
    return (

        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-600">Bem-vindo(a), {user?.firstName}. Aqui está a visão geral do seu negócio.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {canViewSales && (
                    <>
                        <KPIWidget
                            title="Receita Total"
                            value={`R$  ${totalRevenue.toLocaleString('pt-BR')}`}
                        />
                        <KPIWidget
                            title="Total de Pedidos"
                            value={totalOrders}
                        />
                    </>
                )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Gráfico de Vendas</h2>
                {canViewSales ? (
                    <SalesChart orders={salesData?.carts || []} />
                ) : (
                    <p className="text-zinc-500">Você não tem permissão para ver os dados do gráfico.</p>
                )}
            </div>
        </div>
    );
}