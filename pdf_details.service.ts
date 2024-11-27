import { Injectable } from "@angular/core";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Injectable({
  providedIn: "root",
})
export class PdfDetailsService {
  constructor() {
  }
  formatDatePdf(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  async generatePdf(shinseiId:any) {
    const mainContent = document.getElementById("content-to-print");

    if (!mainContent) {
      console.error("Element with ID 'content-to-print' not found");
      return;
    }

    try {
      
         // Check screen width
      if (window.innerWidth < 500) {
        const mainCanvas = await html2canvas(mainContent,{
          scale: 2,
          useCORS: true,
          width: mainContent.scrollWidth,
          height: mainContent.scrollHeight,
        });
        const mainImgData = mainCanvas.toDataURL("image/png");
        const extraPadding = 30; // Padding at the bottom in px
        // Create a new jsPDF instance
        const doc = new jsPDF({
          orientation: "p", // Portrait orientation
          unit: "px",
          format: [mainCanvas.width, mainCanvas.height+extraPadding], // Custom page size based on canvas
        });
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (mainCanvas.height * imgWidth) / mainCanvas.width;
        // Add the captured image to the PDF
        doc.addImage(mainImgData, "PNG", 10, 10, imgWidth, imgHeight); // Adjust position and size as needed
        // Save the PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = pdfUrl;
        downloadLink.download = `shinsei-${("00000000" +shinseiId).slice(-8
        )}-${this.formatDatePdf(new Date())}.pdf`; // Specify the file name
        downloadLink.style.display = "none"; // Hide the link
         // Append the link to the DOM and trigger the download
         document.body.appendChild(downloadLink);
         downloadLink.click();
         document.body.removeChild(downloadLink);
 
         // Revoke the object URL after download
         setTimeout(() => {
           window.URL.revokeObjectURL(pdfUrl);
         }, 100);
      } else {
         // Capture the main content as a canvas
      const mainCanvas = await html2canvas(mainContent);
      const mainImgData = mainCanvas.toDataURL("image/png");

      // Create a new jsPDF instance
      const doc = new jsPDF();
      doc.setProperties({
        title: "shinsei_pdf.php",
        subject: "PDF Subject",
        author: "Author Name",
        keywords: "generated, javascript, web 2.0, ajax",
        creator: "Your App Name",
      });

      // Add the captured image to the PDF
      doc.addImage(mainImgData, "PNG", 10, 10, 190, 0); // Adjust position and size as needed

      // Save the PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const iframe = document.createElement("iframe");
        iframe.style.position = "fixed"; // Position fixed to the screen
        iframe.style.top = "0"; // Top of the page
        iframe.style.left = "0"; // Left of the page
        iframe.style.width = "100%"; // Full width
        iframe.style.height = "100%"; // Full height
        iframe.style.border = "none"; // No border
        iframe.src = pdfUrl;

        // Append iframe to the body
        document.body.appendChild(iframe);
      }
    } catch (error) {
      console.error("Error capturing element:", error);
    }
    
  }
}
