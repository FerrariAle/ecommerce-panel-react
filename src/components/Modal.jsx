import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return createPortal(
        // Fundo escuro
        <div
            // Clicar no fundo fecha o modal.
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        >
            {/* Container do Modal */}
            <div
                // Impede que o clique DENTRO do modal feche-o (propagação de evento).
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
            >
                {/* Cabeçalho do Modal */}
                <div className="flex justify-between items-center p-6 border-b border-zinc-200">
                    <h2 className="text-xl font-bold text-zinc-800">{title}</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-zinc-800">&times;</button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    )
}