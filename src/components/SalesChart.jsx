import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";
import { callback } from "chart.js/helpers";

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

export default function SalesChart({ orders }) {
    const chartData = useMemo(() => {
        if (!orders || orders.length === 0) {
            return { labels: [], datasets: [] };
        }

        const labels = orders.map(order => `Pedido #${order.id}`);
        const dataValues = orders.map(order => order.total);

        return {
            labels,
            datasets: [
                {
                    label: 'Valor do Pedido',
                    data: dataValues,
                    borderColor: '#123524',
                    backgroundColor: 'rgba(18, 53, 36, 0.2)',
                    fill: true,
                    tension: 0.2
                },
            ],
        };
    }, [orders]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Evolução de Vendas',
                font: { size: 18, family: 'Inter', weight: 'bold' }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `R$ ${value.toLocaleString('pt-BR')}`
                }
            }
        }
    };
    return <Line options={chartOptions} data={chartData} />
}