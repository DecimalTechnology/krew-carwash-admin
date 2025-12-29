import React, { useRef } from "react";
import { CreditCard, CheckCircle, XCircle, Clock, AlertCircle, FileText, Copy, Download } from "lucide-react";
import { BookingData } from "../../interface/IBooking";
import { formatCurrency } from "./FormDate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PaymentTabProps {
    booking: BookingData;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ booking }:any) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const getPaymentStatusConfig = (status: string) => {
        const config = {
            "COMPLETED": {
                color: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
                icon: CheckCircle,
                label: "Payment Completed"
            },
            "PENDING": {
                color: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
                icon: Clock,
                label: "Payment Pending"
            },
            "FAILED": {
                color: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
                icon: XCircle,
                label: "Payment Failed"
            },
            "CANCELLED": {
                color: "bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-500/30",
                icon: XCircle,
                label: "Payment Cancelled"
            }
        };
        return config[status as keyof typeof config] || config.PENDING;
    };

    const statusConfig = getPaymentStatusConfig(booking.payment?.status || "PENDING");
    const StatusIcon = statusConfig.icon;

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const calculateSubtotal = () => {
        const packagePrice = booking.package?.price || 0;
        const addonsTotal = booking.addons?.reduce((sum, addon) => sum + (addon.price || 0), 0) || 0;
        return packagePrice + addonsTotal;
    };

    const subtotal = calculateSubtotal();

    const generateInvoiceNumber = () => {
        // Generate invoice number from booking ID and date
        const date = new Date(booking.createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `INV-${year}${month}${day}-${booking._id.slice(-6).toUpperCase()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const downloadInvoice = async () => {
        if (!invoiceRef.current) return;

        try {
            // Create a temporary div for PDF generation
            const tempDiv = document.createElement('div');
            tempDiv.style.width = '210mm'; // A4 width
            tempDiv.style.minHeight = '297mm'; // A4 height
            tempDiv.style.padding = '20px';
            tempDiv.style.backgroundColor = 'white';
            tempDiv.style.color = 'black';
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
                            <h2 style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">CarWash Pro</h2>
                            <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Professional Car Wash Services</p>
                            <p style="font-size: 12px; color: #666; margin: 2px 0;">contact@carwashpro.com</p>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h3 style="font-size: 14px; font-weight: bold; color: #333; margin: 0 0 10px 0;">Bill To:</h3>
                            <p style="font-size: 13px; margin: 5px 0; font-weight: 600;">${booking.userId?.name}</p>
                            <p style="font-size: 13px; margin: 3px 0;">${booking.userId?.email}</p>
                            <p style="font-size: 13px; margin: 3px 0;">Phone: ${booking.userId?.phone}</p>
                            <p style="font-size: 13px; margin: 3px 0;">Apartment: ${booking.userId?.apartmentNumber}</p>
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h3 style="font-size: 14px; font-weight: bold; color: #333; margin: 0 0 10px 0;">Booking Details:</h3>
                            <p style="font-size: 13px; margin: 5px 0;">Booking ID: <strong>${booking.bookingId}</strong></p>
                            <p style="font-size: 13px; margin: 3px 0;">Status: <span style="color: ${booking.payment?.status === 'COMPLETED' ? '#10B981' : '#F59E0B'}; font-weight: 600;">${booking.payment?.status}</span></p>
                            <p style="font-size: 13px; margin: 3px 0;">Booking Date: ${formatDate(booking.createdAt)}</p>
                            <p style="font-size: 13px; margin: 3px 0;">Vehicle: ${booking.vehicleId?.vehicleNumber} - ${booking.vehicleId?.vehicleModel}</p>
                        </div>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <thead>
                            <tr style="background: #5DB7AE; color: white;">
                                <th style="padding: 12px; text-align: left; font-size: 13px; font-weight: 600;">Description</th>
                                <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Quantity</th>
                                <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Unit Price</th>
                                <th style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 12px; font-size: 13px;">
                                    <strong>${booking.package?.packageId?.name}</strong><br/>
                                    <span style="color: #666; font-size: 12px;">${booking.package?.packageId?.description}</span>
                                </td>
                                <td style="padding: 12px; text-align: right; font-size: 13px;">1</td>
                                <td style="padding: 12px; text-align: right; font-size: 13px;">${formatCurrency(booking.package?.price || 0)}</td>
                                <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">${formatCurrency(booking.package?.price || 0)}</td>
                            </tr>
                            ${booking.addons?.map((addon, idx) => `
                                <tr style="border-bottom: 1px solid #e5e7eb;">
                                    <td style="padding: 12px; font-size: 13px;">
                                        <strong>Add-on Service ${idx + 1}</strong><br/>
                                        <span style="color: #666; font-size: 12px;">Additional service package</span>
                                    </td>
                                    <td style="padding: 12px; text-align: right; font-size: 13px;">${addon.totalSessions || 1}</td>
                                    <td style="padding: 12px; text-align: right; font-size: 13px;">${formatCurrency(addon.price || 0)}</td>
                                    <td style="padding: 12px; text-align: right; font-size: 13px; font-weight: 600;">${formatCurrency((addon.price || 0) * (addon.totalSessions || 1))}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
                        <div style="width: 300px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 14px;">Subtotal:</span>
                                <span style="font-size: 14px; font-weight: 600;">${formatCurrency(subtotal)}</span>
                            </div>
                            ${booking.discount && booking.discount > 0 ? `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span style="font-size: 14px; color: #EF4444;">Discount:</span>
                                    <span style="font-size: 14px; font-weight: 600; color: #EF4444;">-${formatCurrency(booking.discount)}</span>
                                </div>
                            ` : ''}
                            <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 2px solid #5DB7AE;">
                                <span style="font-size: 16px; font-weight: bold;">Total Amount:</span>
                                <span style="font-size: 20px; font-weight: bold; color: #5DB7AE;">${formatCurrency(booking.totalPrice)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                                <span style="font-size: 12px; color: #666;">Currency:</span>
                                <span style="font-size: 12px; color: #666;">${booking.payment?.currency || 'AED'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                        <h3 style="font-size: 14px; font-weight: bold; color: #333; margin: 0 0 10px 0;">Payment Information:</h3>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                            <div>
                                <p style="font-size: 13px; margin: 5px 0;"><strong>Payment Method:</strong> ${booking.payment?.method || 'TELR'}</p>
                                <p style="font-size: 13px; margin: 5px 0;"><strong>Transaction ID:</strong> ${booking.payment?.transactionRef || 'N/A'}</p>
                            </div>
                            <div>
                                <p style="font-size: 13px; margin: 5px 0;"><strong>Payment Date:</strong> ${booking.payment?.paidAt ? formatDate(booking.payment.paidAt) : 'N/A'}</p>
                                <p style="font-size: 13px; margin: 5px 0;"><strong>Order Ref:</strong> ${booking.payment?.orderRef || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div style="border-top: 2px solid #5DB7AE; padding-top: 20px; text-align: center;">
                        <p style="font-size: 12px; color: #666; margin: 5px 0;">Thank you for choosing CarWash Pro!</p>
                        <p style="font-size: 11px; color: #999; margin: 5px 0;">This is a computer-generated invoice and does not require a signature.</p>
                        <p style="font-size: 11px; color: #999; margin: 5px 0;">For any queries, contact: support@carwashpro.com</p>
                    </div>
                </div>
            `;
            
            tempDiv.innerHTML = invoiceContent;
            document.body.appendChild(tempDiv);
            
            // Generate PDF
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Invoice_${booking.bookingId}_${new Date().getTime()}.pdf`);
            
            // Clean up
            document.body.removeChild(tempDiv);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate invoice. Please try again.');
        }
    };

    return (
        <>
            {/* Hidden invoice for PDF generation */}
            <div ref={invoiceRef} style={{ display: 'none' }}>
                {/* This div is used for PDF generation */}
            </div>

            <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}></div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">Total Amount Paid</p>
                            <h2 className="text-5xl font-bold mb-4">{formatCurrency(booking.totalPrice)}</h2>
                            <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full ${statusConfig.color} text-sm font-medium`}>
                                <StatusIcon className="w-4 h-4 mr-2" />
                                {statusConfig.label}
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Payment Summary */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Summary</h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Base Package Price</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(booking.package?.price || 0)}</span>
                            </div>
                            
                            {booking.addons && booking.addons.map((addon: any, idx: number) => (
                                <div key={addon._id} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Add-on {idx + 1}</span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Additional service</p>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(addon.price)}</span>
                                </div>
                            ))}

                            <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                            </div>

                            {booking.discount && booking.discount > 0 && (
                                <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">-{formatCurrency(booking.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center py-3 pt-6">
                                <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
                                <span className="font-bold text-xl text-[#5DB7AE]">{formatCurrency(booking.totalPrice)}</span>
                            </div>
                        </div>

                        {/* Payment Details */}
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
                                            {booking.payment?.method || "TELR"} • {booking.payment?.currency || "AED"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Paid On</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {booking.payment?.paidAt ? formatDate(booking.payment.paidAt) : "Not paid yet"}
                                    </p>
                                </div>
                            </div>

                            {/* Transaction References */}
                            {booking.payment?.transactionRef && (
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Transaction References</p>
                                    </div>
                                    <div className="space-y-3">
                                        {booking.payment.transactionRef && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Transaction ID:</span>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {booking.payment.transactionRef}
                                                    </code>
                                                    <button
                                                        onClick={() => handleCopyToClipboard(booking.payment?.transactionRef || "")}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="Copy to clipboard"
                                                    >
                                                        <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {booking.payment.orderRef && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Order Reference:</span>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {booking.payment.orderRef}
                                                    </code>
                                                    <button
                                                        onClick={() => handleCopyToClipboard(booking.payment?.orderRef || "")}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="Copy to clipboard"
                                                    >
                                                        <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {booking.payment.cartId && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Cart ID:</span>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                                        {booking.payment.cartId}
                                                    </code>
                                                    <button
                                                        onClick={() => handleCopyToClipboard(booking.payment?.cartId || "")}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="Copy to clipboard"
                                                    >
                                                        <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Payment Status Notes */}
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
                                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                                The payment attempt was unsuccessful. Please try again or contact support for assistance.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={downloadInvoice}
                                className="flex-1 bg-[#5DB7AE] hover:bg-[#4a9d91] text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-[#5DB7AE]/30 flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Invoice
                            </button>
                            
                            {booking.payment?.status === "PENDING" && (
                                <button className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 px-4 rounded-xl transition-colors border border-gray-200 dark:border-gray-600">
                                    Retry Payment
                                </button>
                            )}
                            
                            {booking.payment?.status === "FAILED" && (
                                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                                    Retry Payment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentTab;