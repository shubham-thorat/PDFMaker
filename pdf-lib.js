const { PDFDocument, StandardFonts, PDFString, PDFName } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");
const { path } = require("pdfkit");
const addToJSON = require("./calculator");
const { default: jsPDF } = require("jspdf");


const createPageLinkAnnotation = (page, uri, rect) =>
  page.doc.context.register(
    page.doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: rect, //reactangle size
      Border: [0, 0, 2], //border size
      C: [0, 0, 0], //color
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(uri),
      },
    }),
  );


async function createPDF() {

  const startTime = Date.now();
  const document = await PDFDocument.load(readFileSync("./pdf/output.pdf"));




  const loadtime = Date.now()
  const courierBoldFont = await document.embedFont(StandardFonts.Courier);
  const firstPage = document.getPage(0);

  const form = document.getForm()

  const nameField = form.getTextField('name')
  const emailField = form.getTextField('email')
  const ageField = form.getTextField('age')
  const checkedField = form.getCheckBox('checked')



  nameField.setText('HI THERE MY NAME IS SHUBHAM THORAT ')
  nameField.setFontSize(10)
  nameField.enableMultiline()


  const link = createPageLinkAnnotation(firstPage, 'https://pdf-lib.js.org/', [100, 100, 100, 100]);
  firstPage.node.set(PDFName.of('Annots'), document.context.obj([link]));

  // const link2 = createPageLinkAnnotation(firstPage, 'https://pdf-lib.js.org/', [0, 0, 100, 100]);
  // firstPage.node.set(PDFName.of('Annots'), document.context.obj([link2]));

  ageField.setText('432')
  emailField.setText('shubham@gmail.com')
  checkedField.check()


  // let prev = 750
  // for (let x = 0; x < 10; x++) {
  //   firstPage.moveTo(80, prev);
  //   firstPage.drawText("Ms. Jane,", {
  //     font: courierBoldFont,
  //     size: 19,
  //   });
  //   prev -= 20
  //   console.log("completed", x)
  // }



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
  writeFileSync("./pdf/interactive.pdf", pdfBytes);

  const endTime = Date.now();
  addToJSON({
    'loadtime': loadtime - startTime,
    'endTime': endTime - startTime
  })
  console.log(JSON.stringify({
    'loadtime': loadtime - startTime,
    'totalTime': endTime - startTime
  }))
}

createPDF().catch((err) => console.log(err));
