import { Download } from "lucide-react";

interface Booking {
  _id: string;
  user: string | null;
  vehicle: string | null;
  cleanersAssigned: number;
  totalPrice: number;
  paymentStatus: string | null;
  cartId: string | null;
  transactionRef: string | null;
  createdAt: string;
  bookingStatus: string;
  package: string | null;
  addon: boolean;
}

interface ExportCSVProps {
  bookings: Booking[];
}

function ExportCSV({ bookings }: ExportCSVProps) {
  const exportToCSV = () => {
    if (!bookings || bookings.length === 0) {
      alert("No bookings to export");
      return;
    }

    // Create CSV headers
    const headers = [
      "Booking ID",
      "Customer",
      "Vehicle",
      "Package",
      "Amount",
      "Payment Status",
      "Booking Status",
      "Transaction Ref",
      "Cart ID",
      "Cleaners Assigned",
      "Addon Used",
      "Date"
    ];

    // Create data rows
    const rows = bookings.map(booking => [
      booking._id,
      booking.user || "",
      booking.vehicle || "",
      booking.package || "",
      `AED ${booking.totalPrice.toFixed(2)}`,
      booking.paymentStatus || "",
      booking.bookingStatus || "",
      booking.transactionRef || "",
      booking.cartId || "",
      booking.cleanersAssigned,
      booking.addon ? "Yes" : "No",
      new Date(booking.createdAt).toLocaleString()
    ]);

    // Combine headers and rows
    const csvData = [headers, ...rows];
    
    // Convert to CSV string
    const csvContent = csvData
      .map(row => 
        row.map(cell => {
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      )
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={!bookings?.length}
      className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      CSV
      <Download size={20} className="ml-2" />
    </button>
  );
}

export default ExportCSV;