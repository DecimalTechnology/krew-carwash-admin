"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Download } from "lucide-react";

interface Booking {
    _id: string;
    user: string | null;
    vehicle: string | null;
    totalPrice: number;
    paymentStatus: string | null;
    transactionRef: string | null;
    createdAt: string;
    bookingStatus: string;
}

interface ExportPdfProps {
    bookings: Booking[];
}

const ExportPdf: React.FC<ExportPdfProps> = ({ bookings }) => {

    const generatePDF = () => {
        if (!bookings || bookings.length === 0) {
            alert("No bookings to export");
            return;
        }

        const doc = new jsPDF("l", "mm", "a4");

        // Title
        doc.setFontSize(20);
        doc.text("Booking Report", 14, 15);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`, 14, 22);
        doc.text(`Total Records: ${bookings.length}`, 14, 27);

        // Prepare table data
        const tableData = bookings.map((booking, index) => [
            index + 1,
            booking._id,
            booking.user || "—",
            booking.vehicle || "—",
            `₹${booking.totalPrice.toFixed(2)}`, // Fixed: Use only ₹ symbol
            booking.paymentStatus || "—",
            booking.bookingStatus || "—",
            booking.transactionRef || "—",
            format(new Date(booking.createdAt), "dd MMM yyyy HH:mm"),
        ]);

        // Create table
        autoTable(doc, {
            startY: 35,
            head: [["#", "Booking ID", "Customer", "Vehicle", "Amount", "Payment Status", "Booking Status", "Transaction Ref", "Date"]],
            body: tableData,
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: 255,
                fontSize: 9,
                fontStyle: "bold",
            },
            bodyStyles: {
                fontSize: 9,
            },
            alternateRowStyles: {
                fillColor: [245, 247, 250],
            },
            columnStyles: {
                0: { cellWidth: 10 },   // #
                1: { cellWidth: 25 },   // Booking ID
                2: { cellWidth: 30 },   // Customer
                3: { cellWidth: 30 },   // Vehicle
                4: { cellWidth: 25 },   // Amount
                5: { cellWidth: 25 },   // Payment Status
                6: { cellWidth: 25 },   // Booking Status
                7: { cellWidth: 35 },   // Transaction Ref
                8: { cellWidth: 30 },   // Date
            },
            margin: { top: 35 },
        });

        // Calculate summary
        const completedPayments = bookings.filter((b) => b.paymentStatus === "COMPLETED").length;
        const totalRevenue = bookings.filter((b) => b.paymentStatus === "COMPLETED").reduce((sum, b) => sum + b.totalPrice, 0);

        // Add summary section
        const finalY = (doc as any).lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.setTextColor(33);
        doc.text("Summary", 14, finalY);

        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(`Total Bookings: ${bookings.length}`, 14, finalY + 8);
        doc.text(`Completed Payments: ${completedPayments}`, 14, finalY + 16);
        doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 14, finalY + 24); // Fixed: Removed "AED"

        // Save PDF
        doc.save(`booking-report-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`);
    };

    return (
        <button
            type="button"
            onClick={generatePDF}
            className="px-4 py-2 flex mr-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!bookings?.length}
        >
            PDF
            <Download size={20} className="ml-2" />
        </button>
    );
};

export default ExportPdf;