
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

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

interface ExportExcelProps {
  bookings: Booking[];
}

function ExportExcel({ bookings }: ExportExcelProps) {
  const exportToExcel = () => {
    if (!bookings || bookings.length === 0) {
      alert("No bookings to export");
      return;
    }

    // Prepare data for Excel
    const excelData = bookings.map((booking, index) => ({
      "#": index + 1,
      "Booking ID": booking._id,
      "Customer": booking.user || "—",
      "Vehicle": booking.vehicle || "—",
      "Package": booking.package || "—",
      "Amount": `AED${booking.totalPrice.toFixed(2)}`,
      "Payment Status": booking.paymentStatus || "—",
      "Booking Status": booking.bookingStatus || "—",
      "Transaction Ref": booking.transactionRef || "—",
      "Cart ID": booking.cartId || "—",
      "Cleaners Assigned": booking.cleanersAssigned,
      "Addon Used": booking.addon ? "Yes" : "No",
      "Date": new Date(booking.createdAt).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }));

    // Calculate summary statistics
    const completedPayments = bookings.filter(
      (b) => b.paymentStatus === "COMPLETED"
    ).length;
    
    const pendingPayments = bookings.filter(
      (b) => b.paymentStatus === "PENDING"
    ).length;
    
    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === "COMPLETED")
      .reduce((sum, b) => sum + b.totalPrice, 0);
    
    const totalWithAddons = bookings.filter((b) => b.addon).length;
    const totalCleaners = bookings.reduce((sum, b) => sum + b.cleanersAssigned, 0);

    // Add summary rows
    const summaryData = [
      {}, // Empty row for spacing
      {
        "#": "SUMMARY",
        "Booking ID": "",
        "Customer": "",
        "Vehicle": "",
        "Package": "",
        "Amount": "",
        "Payment Status": "",
        "Booking Status": "",
        "Transaction Ref": "",
        "Cart ID": "",
        "Cleaners Assigned": "",
        "Addon Used": "",
        "Date": ""
      },
      {
        "#": "Total Bookings",
        "Booking ID": bookings.length,
        "Customer": "",
        "Vehicle": "",
        "Package": "",
        "Amount": "",
        "Payment Status": "",
        "Booking Status": "",
        "Transaction Ref": "",
        "Cart ID": "",
        "Cleaners Assigned": "",
        "Addon Used": "",
        "Date": ""
      },
      {
        "#": "Completed Payments",
        "Booking ID": completedPayments,
        "Customer": "",
        "Vehicle": "",
        "Package": "",
        "Amount": "",
        "Payment Status": "",
        "Booking Status": "",
        "Transaction Ref": "",
        "Cart ID": "",
        "Cleaners Assigned": "",
        "Addon Used": "",
        "Date": ""
      },
      {
        "#": "Pending Payments",
        "Booking ID": pendingPayments,
        "Customer": "",
        "Vehicle": "",
        "Package": "",
        "Amount": "",
        "Payment Status": "",
        "Booking Status": "",
        "Transaction Ref": "",
        "Cart ID": "",
        "Cleaners Assigned": "",
        "Addon Used": "",
        "Date": ""
      },
      {
        "#": "Total Cleaners Assigned",
        "Booking ID": totalCleaners,
        "Customer": "",
        "Vehicle": "",
        "Package": "",
        "Amount": "",
        "Payment Status": "",
        "Booking Status": "",
        "Transaction Ref": "",
        "Cart ID": "",
        "Cleaners Assigned": "",
        "Addon Used": "",
        "Date": ""
      },
      {
        "#": "Bookings with Addons",
        "Booking ID": totalWithAddons,
        "Customer": "",
        "Vehicle": "",
        "Package": "",
        "Amount": "",
        "Payment Status": "",
        "Booking Status": "",
        "Transaction Ref": "",
        "Cart ID": "",
        "Cleaners Assigned": "",
        "Addon Used": "",
        "Date": ""
      },
      {
        "#": "Total Revenue",
        "Booking ID": `₹${totalRevenue.toFixed(2)}`,
        "Customer": "",
        "Vehicle": "",
        "Package": "",
        "Amount": "",
        "Payment Status": "",
        "Booking Status": "",
        "Transaction Ref": "",
        "Cart ID": "",
        "Cleaners Assigned": "",
        "Addon Used": "",
        "Date": ""
      }
    ];

    // Combine data and summary
    const allData = [...excelData, ...summaryData];

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(allData, { skipHeader: false });
    
    // Set column widths for all 12 columns
    const wscols = [
      { wch: 5 },    // #
      { wch: 20 },   // Booking ID
      { wch: 25 },   // Customer
      { wch: 20 },   // Vehicle
      { wch: 20 },   // Package
      { wch: 15 },   // Amount
      { wch: 18 },   // Payment Status
      { wch: 18 },   // Booking Status
      { wch: 25 },   // Transaction Ref
      { wch: 20 },   // Cart ID
      { wch: 18 },   // Cleaners Assigned
      { wch: 15 },   // Addon Used
      { wch: 20 }    // Date
    ];
    ws['!cols'] = wscols;

    // Style summary rows
    const summaryStartRow = excelData.length + 1; // +1 for header row
    
    // Make summary header bold
    const summaryHeaderCell = XLSX.utils.encode_cell({ r: summaryStartRow, c: 0 });
    if (!ws[summaryHeaderCell]) ws[summaryHeaderCell] = {};
    if (ws[summaryHeaderCell]) {
      ws[summaryHeaderCell].s = { font: { bold: true } };
    }

    // Style revenue row (last row in summary)
    const revenueRow = summaryStartRow + 7; // Total Revenue is the 8th summary row
    const revenueCell = XLSX.utils.encode_cell({ r: revenueRow, c: 1 });
    if (!ws[revenueCell]) ws[revenueCell] = {};
    if (ws[revenueCell]) {
      ws[revenueCell].s = { font: { bold: true, color: { rgb: "006400" } } }; // Dark green
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    // Add metadata
    wb.Props = {
      Title: "Booking Report",
      Subject: "Booking Data Export",
      Author: "Your App",
      CreatedDate: new Date()
    };

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
    const filename = `booking-report-${timestamp}.xlsx`;

    // Export file
    XLSX.writeFile(wb, filename);
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={!bookings?.length}
      className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors duration-200 mr-4 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Excel
      <Download size={20} className="ml-2" />
    </button>
  );
}

export default ExportExcel;