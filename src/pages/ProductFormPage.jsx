import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchProductForEdit = async (productId, token) => {
    const response = await fetch(`https://dummyjson.com/products/${productId}`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error("Falha ao buscar dados do produto.");
    return response.json();
};

const createOrUpdateProduct = async ({ token, productId, data }) => {
    const isEditing = Boolean(productId);
    const url = isEditing ? `https://dummyjson.com/products/${productId}` : 'https://dummyjson.com/products/add';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'editar'} o produto.`);
    return response.json();
}

export default function ProductFormPage() {
    const { productId } = useParams();
    const isEditing = Boolean(productId);
    const { token } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const { data, initialData, isLoading: isLoadingInitialData } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProductForEdit(productId, token),
        enabled: isEditing && !!token,
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const mutation = useMutation({
        mutationFn: createOrUpdateProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            if (isEditing) {
                queryClient.invalidateQueries({ queryKey: ['product', productId] });
            }
            alert(`Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigate('/products');
        },
        onError: (error) => alert(error.message),
    });

    const onSubmit = (data) => {
        const mutationVariables = { token, data };
        if (isEditing) {
            mutationVariables.productId = productId;
        }
        mutation.mutate(mutationVariables);
    };

    if (isEditing && isLoadingInitialData) {
        return <p>Carregando dados para edição;;;</p>
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <Link to="/products" className="text-sm font-semibold text-primary-800 hover:underline">&larr; Voltar para a lista</Link>
            <h1 className="text-3xl font-bold">{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                <div>
                    <label htmlFor="title">Nome do Produto</label>
                    <input id="title" {...register('title', { required: 'Título é obrigatório.' })} className="mt-1 block w-full p-2 bg-zinc-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                    <label htmlFor="price">Preço</label>
                    <input id="price" type="number" step="0.01" {...register('price', { required: 'Preço é obrigatório.', valueAsNumber: true })} className="mt-1 block w-full p-2 bg-zinc-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                    <label htmlFor="stock">Estoque</label>
                    <input id="stock" type="number" {...register('stock', { required: 'Estoque é obrigatório.', valueAsNumber: true })} className="mt-1 block w-full p-2 bg-zinc-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                </div>
                <div>
                    <label htmlFor="description">Descrição</label>
                    <textarea id="description" rows="4" {...register('description')} className="mt-1 block w-full p-2 bg-zinc-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <button type="submit" disabled={mutation.isPending} className="w-full py-3 px-4 rounded-full font-bold text-white bg-primary-900 hover:bg-primary-800 disabled:bg-zinc-400">
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Produto')}
                </button>
            </form>
        </div>
    )
}