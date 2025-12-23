/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

export async function generateDashboardPDF(dashboardData: any, range: string) {
  if (!dashboardData) {
    toast.error("No dashboard data to export");
    return;
  }

  const jsPdfUrl = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
  const autoTableUrl = "https://cdn.jsdelivr.net/npm/jspdf-autotable@3.5.28/dist/jspdf.plugin.autotable.min.js";
  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });

  try {
    await loadScript(jsPdfUrl);
    await loadScript(autoTableUrl);
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    let y = 40;

    // Header
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text("Krew Car Wash — Dashboard Report", margin, y);
    doc.setFontSize(10);
    doc.text(`Range: ${range}`, margin, y + 16);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin + 300, y + 16);
    y += 34;

    // Summary stats
    const s = dashboardData?.stats || {};
    doc.setFontSize(11);
    doc.text(`Total Bookings: ${s.totalBookings ?? 0}`, margin, y);
    doc.text(`Revenue (AED): ${Number(s.revenue || 0).toLocaleString()}`, margin + 220, y);
    doc.text(`Active Cleaners: ${s.activeCleaners ?? 0}`, margin + 420, y);
    y += 20;

    // Recent bookings table
    (doc as any).autoTable({
      startY: y + 10,
      head: [["Booking", "Date", "Customer", "Service", "Amount", "Status"]],
      body: (dashboardData?.recentBookings || dashboardData?.bookings || []).map((b: any) => [
        b.bookingId || b._id || b.id || "N/A",
        new Date(b.createdAt || b.date || Date.now()).toLocaleString(),
        b.userId?.name || b.customer || "N/A",
        b.package?.packageId?.name || b.service || "N/A",
        `AED ${Number(b.totalPrice || 0).toLocaleString()}`,
        b.status || "N/A",
      ]),
      theme: "grid",
      headStyles: { fillColor: [93, 183, 174], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || y + 200;

    // Payments
    const payments = dashboardData?.payments || [];
    (doc as any).autoTable({
      startY: finalY + 16,
      head: [["Payment Method", "Amount (AED)"]],
      body: (payments || []).map((p: any) => [p.paymentMethod || p.method || "N/A", Number(p.amount || p.total || 0).toLocaleString()]),
      theme: "plain",
      headStyles: { fillColor: [240, 249, 248], textColor: 80 },
      styles: { fontSize: 10 },
      margin: { left: margin, right: margin },
    });

    // Footer page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - margin - 60, doc.internal.pageSize.getHeight() - 30);
    }

    const filename = `dashboard-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error("Export failed", err);
    toast.error("Failed to export PDF");
    throw err;
  }
}


