export const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
    }).format(amount);
};

export const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
        case "ASSIGNED":
            return "bg-[#5DB7AE]/10 text-[#5DB7AE] ring-[#5DB7AE]/20";
        case "COMPLETED":
            return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
        case "PENDING":
            return "bg-amber-50 text-amber-700 ring-amber-600/20";
        case "CANCELLED":
            return "bg-red-50 text-red-700 ring-red-600/20";
        default:
            return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
};