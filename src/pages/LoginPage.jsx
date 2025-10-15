import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [apiError, setApiError] = useState(null);
    const { login, isAuthenticating } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setApiError(null);
        try {
            await login(data.username, data.password);
        } catch (err) {
            setApiError(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-sm">

                {apiError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4" role="alert">
                        <p>{apiError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="username">Usuário</label>
                        <input
                            id="username"
                            type="text"
                            {...register('username', { required: 'Usuário é obrigatório.' })}
                            className="mt-1 block w-full px-3 py-2 bg-zinc-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: 'A senha é obrigatória.' })}
                            className="mt-1 block w-full px-3 py-2 bg-zinc-100 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full flex justify-center py-3 px-4 mt-2 rounded-full font-bold text-white bg-primary-900 hover:bg-primary-800 disabled:bg-zinc-400"
                        >
                            {isAuthenticating ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}