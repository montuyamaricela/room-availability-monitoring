/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef } from "react";
import { useRoomStore } from "~/store/useRoomStore";
import Barcode from "react-barcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../ui/button";
import { Container } from "../common/Container";

export default function BarcodeList() {
  const { rooms } = useRoomStore();
  const barcodeContainerRef = useRef<HTMLDivElement>(null);

  // Function to generate the PDF
  const exportBarcodesAsPDF = async () => {
    const input = barcodeContainerRef.current;
    if (!input) return;

    const pdf = new jsPDF("p", "mm", "legal", true);
    const padding = 10; // Padding for better visuals on PDF

    // Convert the barcodes container to a canvas using html2canvas
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - padding * 2;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", padding, padding, pdfWidth, pdfHeight);
    pdf.save("room-barcodes.pdf");
  };

  return (
    <Container>
      <div className="mt-10 text-center">
        <h2 className="mb-5 text-4xl font-bold">Room Barcode List</h2>
        <Button
          onClick={exportBarcodesAsPDF}
          className="rounded bg-primary-green px-4 py-2 text-white hover:bg-primary-green"
        >
          Export barcodes as PDF
        </Button>
      </div>

      <div ref={barcodeContainerRef} className="mt-5 grid grid-cols-4 gap-5">
        {rooms.map((item) => {
          return (
            <div key={item.id} className="border">
              <Barcode
                width={2.8}
                renderer="img"
                fontSize={20}
                height={50}
                value={item.id}
              />
            </div>
          );
        })}
      </div>
    </Container>
  );
}
