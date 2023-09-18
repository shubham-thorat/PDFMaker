const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");
const { path } = require("pdfkit");
const addToJSON = require("./calculator");

async function createPDF() {

  const startTime = Date.now();
  const document = await PDFDocument.load(readFileSync("./sample_500KB.pdf"));


  const loadtime = Date.now()
  const courierBoldFont = await document.embedFont(StandardFonts.Courier);
  const firstPage = document.getPage(0);


  firstPage.moveTo(80, 750);
  firstPage.drawText("Ms. Jane,", {
    font: courierBoldFont,
    size: 19,
  });


  // firstPage.moveTo(200, 750);
  // firstPage.drawText(new Date().toDateString(), {
  //   font: courierBoldFont,
  //   size: 19,
  // });


  // const imgBuffer = readFileSync("./static/user.jpeg");
  // const img = await document.embedJpg(imgBuffer);

  // firstPage.drawImage(img, {
  //   x: 400,
  //   y: 700,
  //   width: 100,
  //   height: 100
  // })

  const pdfBytes = await document.save()
  // console.log(pdfBytes)
  writeFileSync("jane-doe.pdf", pdfBytes);

  const endTime = Date.now();
  addToJSON({
    'loadtime': loadtime - startTime,
    'endTime': endTime - startTime
  })
  console.log(JSON.stringify({
    'loadtime': loadtime - startTime,
    'endTime': endTime - startTime
  }))
}

createPDF().catch((err) => console.log(err));
