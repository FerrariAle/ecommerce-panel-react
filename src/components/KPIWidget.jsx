export default function KPIWidget({ title, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center">
                {icon && <div className="mr-4 text-primary-900">{icon}</div>}
                <div>
                    <h2 className="text-sm font-semibold text-zinc-500">{title}</h2>
                    <p className="text-3xl font-bold mt-1 text-zinc-800">{value}</p>
                </div>
            </div>
        </div>
    )
}