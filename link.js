const createPageLinkAnnotation = (page: PDFPage, uri: string) =>
  page.doc.context.register(
    page.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [0, 30, 40, 230],
      Border: [0, 0, 2],
      C: [0, 0, 1],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(uri),
      },
    }),
  );

(async () => {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const page = pdfDoc.addPage();
  page.drawText('https://pdf-lib.js.org/', {
    x: 23,
    y: 43,
    size: 20,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(90),
  });

  const link = createPageLinkAnnotation(page, 'https://pdf-lib.js.org/');
  page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([link]));

  const pdfBytes = await pdfDoc.save();
})();