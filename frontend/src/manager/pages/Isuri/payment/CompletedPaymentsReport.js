import React, { useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const CompletedPaymentsReport = () => {
  useEffect(() => {
    const generatePDF = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ITPM/payments");
        const completed = response.data.filter(p => p.status === "Completed");

        if (!completed.length) {
          alert("No completed payments to export.");
          return;
        }

        const tableColumn = ["Txn ID", "Amount (Rs.)", "Method", "Status"];
        const tableRows = completed.map(p => [
          p.transactionId,
          p.amount.toFixed(2),
          p.paymentMethod,
          p.status
        ]);

        const doc = new jsPDF();

        const logo = new Image();
        logo.src = "/DineMate_Yellow.png"; // ✅ Relative to public folder

        logo.onload = () => {
          // 🖼️ Add logo image to PDF (x, y, width, height)
          doc.addImage(logo, "PNG", 15, 10, 25, 25);

          // 📝 Add centered title
          doc.setFontSize(20);
          doc.text("DineMate", 105, 20, { align: "center" });

          doc.setFontSize(14);
          doc.text("Completed Payments Report", 105, 30, { align: "center" });

          // 📊 Add table
          autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: "grid",
          });

          // 📅 Add printed date
          const printedDate = new Date().toLocaleString();
          doc.setFontSize(10);
          doc.text(`Printed on: ${printedDate}`, 14, doc.lastAutoTable.finalY + 10);

          // 💾 Save PDF
          const date = new Date().toISOString().split("T")[0];
          doc.save(`Completed_Payments_Report_${date}.pdf`);
        };
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Check console for details.");
      }
    };

    generatePDF();
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-semibold text-gray-700">
        Generating and downloading PDF report...
      </h2>
    </div>
  );
};

export default CompletedPaymentsReport;
