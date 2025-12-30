import React, { useRef } from "react";
import { CreditCard, CheckCircle, XCircle, Clock, AlertCircle, Copy, Download, Hash } from "lucide-react";
import { BookingData } from "../../interface/IBooking";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PaymentTabProps {
    booking: BookingData;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ booking }: any) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const getPaymentStatusConfig = (status: string) => {
        const config = {
            COMPLETED: {
                color: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
                icon: CheckCircle,
                label: "Payment Completed",
            },
            PENDING: {
                color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
                icon: Clock,
                label: "Payment Pending",
            },
            FAILED: {
                color: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
                icon: XCircle,
                label: "Payment Failed",
            },
            CANCELLED: {
                color: "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30",
                icon: XCircle,
                label: "Payment Cancelled",
            },
        };
        return config[status as keyof typeof config] || config.PENDING;
    };

    const statusConfig = getPaymentStatusConfig(booking.payment?.status || "PENDING");
    const StatusIcon = statusConfig.icon;

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const calculateSubtotal = () => {
        const packagePrice = booking.package?.price || 0;
        const addonsTotal = booking.addons?.reduce((sum, addon) => {
            // The addon.price already includes the quantity calculation
            // So we just add the price directly
            return sum + (addon.price || 0);
        }, 0) || 0;
        return packagePrice + addonsTotal;
    };

    const subtotal = calculateSubtotal();

    const generateInvoiceNumber = () => {
        const date = new Date(booking.createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `INV-${year}${month}${day}-${booking._id.slice(-6).toUpperCase()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Custom format function for AED
    const formatAED = (amount: number): string => {
        if (isNaN(amount)) return "AED 0.00";
        return `AED ${amount.toFixed(2)}`;
    };

    const downloadInvoice = async () => {
        if (!invoiceRef.current) return;

        try {
            const tempDiv = document.createElement("div");
            tempDiv.style.width = "210mm";
            tempDiv.style.minHeight = "297mm";
            tempDiv.style.padding = "20px";
            tempDiv.style.backgroundColor = "white";
            tempDiv.style.color = "black";
            tempDiv.style.fontFamily = "'Helvetica', 'Arial', sans-serif";

            const invoiceContent = `
                <div style="margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <div>
                            <h1 style="font-size: 28px; font-weight: bold; color: #5DB7AE; margin: 0;">INVOICE</h1>
                            <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Invoice No: ${generateInvoiceNumber()}</p>
                            <p style="font-size: 12px; color: #666; margin: 2px 0;">Date: ${formatDate(booking.createdAt)}</p>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">Krew Car Wash</h2>
                            <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Professional Car Wash Services</p>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h3 style="font-size: 14px; font-weight: bold; color: #333; margin: 0 0 10px 0;">Customer Details</h3>
                            <p style="font-size: 13px; margin: 5px 0; font-weight: 600;">${booking.userId?.name || "Customer"}</p>
                            ${booking.userId?.phone ? `<p style="font-size: 13px; margin: 3px 0;">Phone: ${booking.userId.phone}</p>` : ""}
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h3 style="font-size: 14px; font-weight: bold; color: #333; margin: 0 0 10px 0;">Booking Details</h3>
                            <p style="font-size: 13px; margin: 5px 0;">Booking ID: <strong>${booking.bookingId}</strong></p>
                            <p style="font-size: 13px; margin: 3px 0;">Status: <span style="color: ${booking.payment?.status === "COMPLETED" ? "#10B981" : "#F59E0B"}; font-weight: 600;">${
                booking.payment?.status
            }</span></p>
                            <p style="font-size: 13px; margin: 3px 0;">Booking Date: ${formatDate(booking.createdAt)}</p>
                            <p style="font-size: 13px; margin: 3px 0;">Vehicle: ${booking.vehicleId?.vehicleNumber || "N/A"} - ${booking.vehicleId?.vehicleModel || "N/A"}</p>
                        </div>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr style="background: #5DB7AE; color: white;">
                                <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600;">Description</th>
                                <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Sessions</th>
                                <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 12px; font-size: 13px;">
                                    <strong>${booking.package?.packageId?.name || "Car Wash Package"}</strong>
                                </td>
                                <td style="padding: 12px; text-align: right; font-size: 13px;">${booking.package?.totalSessions || 1}</td>
                                <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">${formatAED(booking.package?.price || 0)}</td>
                            </tr>
                            ${booking.addons
                                ?.map(
                                    (addon, idx) => {
                                        const addonName = addon.addonId?.name || `Add-on Service ${idx + 1}`;
                                        const totalPrice = addon.price || 0;
                                        const sessions = addon.totalSessions || 1;
                                        
                                        return `
                                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                                <td style="padding: 12px; font-size: 13px;">
                                                    <strong>${addonName}</strong>
                                                </td>
                                                <td style="padding: 12px; text-align: right; font-size: 13px;">${sessions}</td>
                                                <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">${formatAED(totalPrice)}</td>
                                            </tr>
                                        `;
                                    }
                                )
                                .join("")}
                        </tbody>
                    </table>
                    
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
                        <div style="width: 300px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 14px;">Subtotal:</span>
                                <span style="font-size: 14px; font-weight: 600;">${formatAED(subtotal)}</span>
                            </div>
                            ${
                                booking.discount && booking.discount > 0
                                    ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-size: 14px; color: #EF4444;">Discount:</span>
                                    <span style="font-size: 14px; font-weight: 600; color: #EF4444;">-${formatAED(booking.discount)}</span>
                                </div>
                            `
                                    : ""
                            }
                            <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #5DB7AE;">
                                <span style="font-size: 16px; font-weight: bold;">Total Amount:</span>
                                <span style="font-size: 20px; font-weight: bold; color: #5DB7AE;">${formatAED(booking.totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #5DB7AE;">
                        <h3 style="font-size: 14px; font-weight: bold; color: #333; margin: 0 0 15px 0;">Reference Identifiers</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="border-bottom: 1px dashed #e5e7eb; padding-bottom: 8px;">
                                <p style="font-size: 12px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Booking ID</p>
                                <p style="font-size: 13px; color: #333; margin: 0; font-family: monospace;">${booking.bookingId}</p>
                            </div>
                            <div style="border-bottom: 1px dashed #e5e7eb; padding-bottom: 8px;">
                                <p style="font-size: 12px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Invoice No</p>
                                <p style="font-size: 13px; color: #333; margin: 0; font-family: monospace;">${generateInvoiceNumber()}</p>
                            </div>
                            ${
                                booking.payment?.transactionRef
                                    ? `
                                <div style="border-bottom: 1px dashed #e5e7eb; padding-bottom: 8px;">
                                    <p style="font-size: 12px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Transaction ID</p>
                                    <p style="font-size: 13px; color: #333; margin: 0; font-family: monospace;">${booking.payment.transactionRef}</p>
                                </div>
                            `
                                    : ""
                            }
                            ${
                                booking.payment?.orderRef
                                    ? `
                                <div style="border-bottom: 1px dashed #e5e7eb; padding-bottom: 8px;">
                                    <p style="font-size: 12px; color: #666; margin: 0 0 4px 0; font-weight: 600;">Order Reference</p>
                                    <p style="font-size: 13px; color: #333; margin: 0; font-family: monospace;">${booking.payment.orderRef}</p>
                                </div>
                            `
                                    : ""
                            }
                        </div>
                    </div>
                    
                    <div style="border-top: 2px solid #5DB7AE; padding-top: 20px; text-align: center;">
                        <p style="font-size: 12px; color: #666; margin: 5px 0;">Thank you for choosing Krew Car Wash!</p>
                        <p style="font-size: 11px; color: #999; margin: 5px 0;">This is a computer-generated invoice and does not require a signature.</p>
                    </div>
                </div>
            `;

            tempDiv.innerHTML = invoiceContent;
            document.body.appendChild(tempDiv);

            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice_${booking.bookingId}_${new Date().getTime()}.pdf`);

            document.body.removeChild(tempDiv);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate invoice. Please try again.");
        }
    };

    return (
        <>
            <div ref={invoiceRef} style={{ display: "none" }}></div>

            <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            ></div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">Total Amount Paid</p>
                            <h2 className="text-5xl font-bold mb-4">{formatAED(booking.totalPrice)}</h2>
                            <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full ${statusConfig.color} text-sm font-medium`}>
                                <StatusIcon className="w-4 h-4 mr-2" />
                                {statusConfig.label}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Base Package</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatAED(booking.package?.price || 0)}</span>
                            </div>

                            {booking.addons &&
                                booking.addons.map((addon: any, idx: number) => {
                                    const addonName = addon.addonId?.name || `Add-on Service ${idx + 1}`;
                                    const totalPrice = addon.price || 0;
                                    const sessions = addon.totalSessions || 1;
                                    
                                    return (
                                        <div key={addon._id} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                            <div>
                                                <span className="text-gray-600 dark:text-gray-400">{addonName}</span>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {sessions} session{sessions !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatAED(totalPrice)}</span>
                                        </div>
                                    );
                                })}

                            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatAED(subtotal)}</span>
                            </div>

                            {booking.discount && booking.discount > 0 && (
                                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">-{formatAED(booking.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center py-3 pt-6">
                                <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                                <span className="font-bold text-xl text-[#5DB7AE]">{formatAED(booking.totalPrice)}</span>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Details</h3>

                        <div className="space-y-4 mb-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                        <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Payment Method</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {booking.payment?.method || "TELR"} • AED
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Paid On</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.payment?.paidAt ? formatDate(booking.payment.paidAt) : "Not paid yet"}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Hash className="w-5 h-5 text-[#5DB7AE]" />
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Reference Identifiers</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-600">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Booking ID</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{booking.bookingId}</code>
                                            <button
                                                onClick={() => handleCopyToClipboard(booking.bookingId)}
                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-600">
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Invoice No</span>
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{generateInvoiceNumber()}</code>
                                            <button
                                                onClick={() => handleCopyToClipboard(generateInvoiceNumber())}
                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                title="Copy to clipboard"
                                            >
                                                <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {booking.payment?.transactionRef && (
                                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Transaction ID</span>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{booking.payment.transactionRef}</code>
                                                <button
                                                    onClick={() => handleCopyToClipboard(booking.payment.transactionRef)}
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {booking.payment?.orderRef && (
                                        <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-600">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Order Reference</span>
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{booking.payment.orderRef}</code>
                                                <button
                                                    onClick={() => handleCopyToClipboard(booking.payment.orderRef)}
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {booking.payment?.status === "PENDING" && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Payment Pending</p>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                                This booking is awaiting payment confirmation. Services will be scheduled once payment is completed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {booking.payment?.status === "FAILED" && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-red-800 dark:text-red-300">Payment Failed</p>
                                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">The payment attempt was unsuccessful. Please try again or contact support for assistance.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={downloadInvoice}
                                className="flex-1 bg-[#5DB7AE] hover:bg-[#4a9d91] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#5DB7AE]/30 flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Invoice
                            </button>

                            {booking.payment?.status === "FAILED" && (
                                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">Retry Payment</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentTab;