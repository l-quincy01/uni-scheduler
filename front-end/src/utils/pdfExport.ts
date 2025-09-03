import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
// import { usePDF } from "react-to-pdf";
import { toast } from "sonner";

export const handleDownloadPDF = () => {
  const exportTask = async () => {
    const blocks = document.querySelectorAll(".pdf-block");
    const pdf = new jsPDF({
      unit: "px",
      format: "a4",
      orientation: "portrait",
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const padding = 20;

    let currentY = padding;

    for (let i = 0; i < blocks.length; i++) {
      const original = blocks[i] as HTMLElement;

      const clone = original.cloneNode(true) as HTMLElement;
      clone.classList.add("force-light-mode");

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = `${800 - padding * 2}px`;
      container.style.boxSizing = "border-box";

      clone.style.width = "100%";
      clone.style.boxSizing = "border-box";

      container.appendChild(clone);
      document.body.appendChild(container);

      await new Promise((res) => setTimeout(res, 50));

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const imgHeight =
        (canvas.height * (pageWidth - padding * 2)) / canvas.width;

      if (currentY + imgHeight > pageHeight - padding) {
        pdf.addPage();
        currentY = padding;
      }

      pdf.addImage(
        imgData,
        "PNG",
        padding,
        currentY,
        pageWidth - padding * 2,
        imgHeight
      );
      currentY += imgHeight + 10;
    }

    pdf.save("mockExam.pdf");

    return { name: "PDF" };
  };

  toast.promise(exportTask(), {
    loading: "Exporting to PDF...",
    success: (data) => `${data.name} downloaded successfully.`,
    error: "Failed to export PDF.",
  });
};
