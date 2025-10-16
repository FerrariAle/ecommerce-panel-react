import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const ITEMS_PER_PAGE = 10;

const fetchProducts = async ({ token, page, sortBy, order, searchTerm }) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const baseUrl = searchTerm ? `https://dummyjson.com/products/search?q=${searchTerm}` : 'https://dummyjson.com/products';
    const queryParams = searchTerm
        ? `&limit=${ITEMS_PER_PAGE}&skip=${skip}`
        : `?limit=${ITEMS_PER_PAGE}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
    const url = `${baseUrl}${queryParams}`;

    const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error("Falha ao buscar produtos.");
    return response.json();
}

const deleteProduct = async ({ token, productId }) => {
    const response = await fetch(`https://dummyjson.com/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Falha ao deletar o produto.");
    return response.json();
}

export default function ProductsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const { user, token } = useAuth();
    const queryClient = useQueryClient();

    const canManageProducts = user?.role === 'admin' || user?.role === 'stock_manager';

    useEffect(() => {
        const timerId = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    const { data, status, error, isFetching } = useQuery({
        queryKey: ['products', currentPage, sortColumn, sortOrder, debouncedSearchTerm, token],
        queryFn: () => fetchProducts({ token, page: currentPage, sortBy: sortColumn, order: sortOrder, searchTerm: debouncedSearchTerm }),
        enable: !!token,
        placeholderData: (previousData) => previousData,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            alert("Produto deletado com sucesso!")
        },
        onError: (err) => alert(`Erro ao deletar: ${err.message}`),
    });

    const handleDelete = (productId) => {
        if (window.confirm("Tem certeza que deseja deletar este produto?")) {
            deleteMutation.mutate({ token, productId });
        }
    };

    const handleSort = (columnName) => {
        if (sortColumn === columnName) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(columnName);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    if (status === 'pending' && !data) return <p>Carregando...</p>;
    if (status === 'error') return <p className="text-red-500">Erro: {error.message}</p>

    return (
        <div className={`space-y-6 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
                {canManageProducts && (
                    <Link to="/products/new" className="bg-primary-900 text-white font-bold py-2 px-6 rounded-full text-sm hover:bg-primary-800 transition-colors">
                        Adicionar Produto
                    </Link>
                )}
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full max-w-sm p-3 bg-white border border-zinc-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <div className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-zinc-200">
                                <th className="p-4"><button onClick={() => handleSort('title')}>Produto</button></th>
                                <th className="p-4"><button onClick={() => handleSort('brand')}>Marca</button></th>
                                <th className="p-4"><button onClick={() => handleSort('price')}>Preço</button></th>
                                <th className="p-4"><button onClick={() => handleSort('stock')}>Estoque</button></th>
                                {canManageProducts && <th className="p-4">Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.products?.map(product => (
                                <tr key={product.id} className="border-b border-zinc-200 last:border-b-0">
                                    <td className="p-4 font-semibold text-zinc-800">{product.title}</td>
                                    <td className="p-4 text-zinc-600">{product.brand}</td>
                                    <td className="p-4 text-zinc-800">R$ {product.price.toFixed(2)}</td>
                                    <td className="p-4 text-zinc-600">{product.stock}</td>
                                    {canManageProducts && (
                                        <td className="p-4">
                                            <div className="flex gap-4">
                                                <Link to={`/products/${product.id}/edit`} className="font-semibold text-primary-800 hover:underline">Editar</Link>
                                                <button onClick={() => handleDelete(product.id)} className="font-semibold text-red-600 hover:underline">Deletar</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Página {currentPage} de {totalPages}</span>
                    <div className="flex gap-2">
                        <button onClick={handlePrevPage} disabled={currentPage === 1 || isFetching} className="px-4 py-2 text-sm font-semibold bg-white border border-zinc-300 rounded-full hover:bg-zinc-100 disabled:opacity-50">Anterior</button>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages || isFetching} className="px-4 py-2 text-sm font-semibold bg-white border border-zinc-300 rounded-full hover:bg-zinc-100 disabled:opacity-50">Próxima</button>
                    </div>
                </div>
            </div>
        </div>
    );
}