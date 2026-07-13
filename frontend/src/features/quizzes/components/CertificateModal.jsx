import React, { useRef } from "react";
import { X, Download, Printer, Award } from "lucide-react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import xebiaLogo from "../../../assets/xebia-logo.png";

export default function CertificateModal({
  isOpen,
  onClose,
  studentName = "Jane Doe",
  courseName = "Cloud Native Engineering",
  quizName = "React State Management",
  date = "Jul 9, 2026",
  percentage = 100
}) {
  const previewRef = useRef(null);

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    // 1. Background
    const grad = ctx.createRadialGradient(960, 540, 100, 960, 540, 1000);
    grad.addColorStop(0, "#FFFFFF");
    grad.addColorStop(1, "#FAF6F0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1920, 1080);

    // 2. Borders
    // Outer border (Xebia Purple)
    ctx.strokeStyle = "#6C1D5F";
    ctx.lineWidth = 16;
    ctx.strokeRect(40, 40, 1840, 1000);

    // Inner thin border (Gold)
    ctx.strokeStyle = "#C5A880";
    ctx.lineWidth = 3;
    ctx.strokeRect(65, 65, 1790, 950);

    // Corner Ornaments
    ctx.fillStyle = "#C5A880";
    // Top-Left corner block
    ctx.fillRect(75, 75, 40, 6);
    ctx.fillRect(75, 75, 6, 40);
    // Top-Right corner block
    ctx.fillRect(1805, 75, 40, 6);
    ctx.fillRect(1839, 75, 6, 40);
    // Bottom-Left corner block
    ctx.fillRect(75, 999, 40, 6);
    ctx.fillRect(75, 965, 6, 40);
    // Bottom-Right corner block
    ctx.fillRect(1805, 999, 40, 6);
    ctx.fillRect(1839, 965, 6, 40);

    // Load Xebia Logo Image
    const logoImg = new Image();
    logoImg.onload = () => {
      // Draw Logo at top center (approx 240x80)
      const logoWidth = 240;
      const logoHeight = 80;
      const logoX = 960 - (logoWidth / 2);
      const logoY = 130;
      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

      // Draw all certificate text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Certificate Heading
      ctx.fillStyle = "#6C1D5F";
      ctx.font = "bold 46px sans-serif";
      ctx.fillText("CERTIFICATE OF COMPLETION", 960, 310);

      // Accent Divider Line
      ctx.strokeStyle = "#C5A880";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(820, 350);
      ctx.lineTo(1100, 350);
      ctx.stroke();

      // Body text 1
      ctx.fillStyle = "#64748B";
      ctx.font = "italic 24px Georgia, serif";
      ctx.fillText("This is to certify that", 960, 410);

      // Student Name
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 60px sans-serif";
      ctx.fillText(studentName, 960, 490);

      // Thin divider
      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(720, 545);
      ctx.lineTo(1200, 545);
      ctx.stroke();

      // Body text 2
      ctx.fillStyle = "#64748B";
      ctx.font = "24px sans-serif";
      ctx.fillText("has successfully completed the assignment assessment", 960, 600);

      // Quiz/Assignment Name (Large and bold)
      ctx.fillStyle = "#6C1D5F";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(quizName, 960, 660);

      // Course Context
      ctx.fillStyle = "#64748B";
      ctx.font = "24px sans-serif";
      ctx.fillText(`under the course: ${courseName}`, 960, 725);

      // Achievement details
      ctx.fillStyle = "#64748B";
      ctx.font = "20px sans-serif";
      ctx.fillText(`Completed on: ${date}  |  Score achieved: ${percentage}%`, 960, 795);

      // Signature line divider
      ctx.strokeStyle = "#C5A880";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(840, 895);
      ctx.lineTo(1080, 895);
      ctx.stroke();

      // Signature text
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Xebia Academy Team", 960, 920);
      ctx.fillStyle = "#94A3B8";
      ctx.font = "16px sans-serif";
      ctx.fillText("Authorized Representative", 960, 950);

      // Trigger automatic file download
      try {
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        const safeQuizName = quizName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        link.download = `${safeQuizName}_certificate.png`;
        link.href = url;
        link.click();
      } catch (err) {
        console.error("Failed to generate download URL", err);
      }
    };

    logoImg.src = xebiaLogo;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const absoluteLogoUrl = xebiaLogo.startsWith("data:") 
      ? xebiaLogo 
      : (xebiaLogo.startsWith("http") ? xebiaLogo : window.location.origin + xebiaLogo);

    printWindow.document.write(`
      <html>
        <head>
          <title>${quizName} - Certificate</title>
          <style>
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              font-family: 'Geist', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .cert-container {
              width: 297mm;
              height: 210mm;
              box-sizing: border-box;
              border: 10px solid #6C1D5F;
              padding: 30px;
              position: relative;
              background: radial-gradient(circle, #ffffff 10%, #faf6f0 100%);
            }
            .cert-inner {
              border: 2px solid #C5A880;
              height: 100%;
              width: 100%;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 40px;
            }
            .logo {
              height: 60px;
              margin-bottom: 25px;
            }
            .title {
              color: #6C1D5F;
              font-size: 32px;
              font-weight: 900;
              margin: 0 0 10px 0;
              letter-spacing: 1px;
            }
            .divider {
              width: 150px;
              height: 2px;
              background-color: #C5A880;
              margin-bottom: 20px;
            }
            .subtitle {
              color: #64748B;
              font-style: italic;
              font-size: 16px;
              margin-bottom: 15px;
            }
            .name {
              color: #1E293B;
              font-size: 38px;
              font-weight: 800;
              margin-bottom: 15px;
            }
            .text {
              color: #64748B;
              font-size: 16px;
              text-align: center;
              margin-bottom: 10px;
            }
            .highlight {
              color: #6C1D5F;
              font-size: 22px;
              font-weight: 800;
              margin-bottom: 15px;
            }
            .meta {
              color: #64748B;
              font-size: 13px;
              margin-bottom: 40px;
            }
            .sig-line {
              width: 200px;
              height: 1.5px;
              background-color: #C5A880;
              margin-bottom: 8px;
            }
            .sig-text {
              font-weight: bold;
              font-size: 14px;
              color: #1E293B;
            }
            .sig-title {
              font-size: 11px;
              color: #94A3B8;
            }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <div class="cert-inner">
              <img class="logo" src="${absoluteLogoUrl}" alt="Xebia" />
              <h1 class="title">CERTIFICATE OF COMPLETION</h1>
              <div class="divider"></div>
              <p class="subtitle">This is to certify that</p>
              <div class="name">${studentName}</div>
              <p class="text">has successfully completed the assignment assessment</p>
              <div class="highlight">${quizName}</div>
              <p class="text" style="margin-bottom: 5px;">under the course: <strong>${courseName}</strong></p>
              <p class="meta">Completed on: ${date}  |  Score achieved: ${percentage}%</p>
              <div class="sig-line"></div>
              <div class="sig-text">Xebia Academy Team</div>
              <div class="sig-title">Authorized Representative</div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] md:w-[750px] max-w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-0">
        
        {/* Header toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Award className="text-[#6C1D5F]" size={20} />
            <span className="font-bold text-slate-800 text-sm">Completion Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="text-slate-650 hover:bg-slate-100 flex items-center gap-1.5 h-8 font-semibold text-xs rounded-lg"
            >
              <Printer size={14} />
              Print
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white flex items-center gap-1.5 h-8 font-bold text-xs rounded-lg shadow-sm"
            >
              <Download size={14} />
              Download
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon-xs"
              className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Certificate Landscape Preview Screen */}
        <div className="p-6 md:p-8 bg-slate-100 overflow-x-auto flex justify-center items-center">
          <div 
            ref={previewRef}
            className="w-[650px] aspect-[1.414/1] bg-white border-[8px] border-[#6C1D5F] p-5 shadow-lg rounded-sm relative overflow-hidden flex flex-col justify-between select-none"
            style={{ minWidth: "650px", background: "radial-gradient(circle, #ffffff 10%, #faf6f0 100%)" }}
          >
            {/* Inner Border */}
            <div className="border border-[#C5A880] flex-1 flex flex-col items-center justify-center p-4 relative">
              
              {/* Decorative Corner Ornaments */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-[#C5A880]" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-[#C5A880]" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-[#C5A880]" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-[#C5A880]" />

              {/* Logo */}
              <img src={xebiaLogo} alt="Xebia" className="h-10 object-contain mb-4" />

              {/* Title */}
              <h2 className="text-[#6C1D5F] font-black text-center tracking-wider text-base uppercase leading-none">
                Certificate of Completion
              </h2>
              <div className="w-24 h-[1px] bg-[#C5A880] my-2" />

              {/* Presented to */}
              <p className="text-[11px] italic text-slate-400 font-serif leading-none mt-1">
                This is to certify that
              </p>

              {/* Student Name */}
              <h1 className="text-slate-800 font-extrabold text-xl tracking-tight text-center my-1.5 leading-none">
                {studentName}
              </h1>

              {/* Completion text */}
              <p className="text-[10px] text-slate-500 text-center max-w-md mt-1 leading-relaxed">
                has successfully completed the assignment assessment
              </p>

              {/* Quiz name */}
              <h3 className="text-[#6C1D5F] font-bold text-center text-sm leading-tight my-1">
                {quizName}
              </h3>

              {/* Course name */}
              <p className="text-[10px] text-slate-450 text-center leading-normal">
                under the course: <span className="font-bold text-slate-700">{courseName}</span>
              </p>

              {/* Meta details */}
              <p className="text-[9px] text-slate-400 text-center mt-2 leading-none">
                Completed on {date} | Score achieved: <span className="font-semibold text-[#6C1D5F]">{percentage}%</span>
              </p>

              {/* Signature Block */}
              <div className="mt-4 flex flex-col items-center">
                <div className="w-32 h-[1px] bg-slate-200 mb-1" />
                <span className="text-[9.5px] font-bold text-slate-700 leading-none">Xebia Academy Team</span>
                <span className="text-[8px] text-slate-400 mt-0.5 leading-none">Authorized Representative</span>
              </div>

            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
