const fs = require('fs');
const pdfMake = require('pdfmake');

// Create a new instance of pdfmake
const fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/fonts/Roboto/Roboto-Bold.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/fonts/Roboto/Roboto-BoldItalic.ttf',
  },
};

const pdfPrinter = new pdfMake({ fonts });
// Define your PDF content
const documentDefinition = {
  content: [
    'Hello, PDF!',
    'This is a basic PDF generated using pdfmake on the server side.',
  ],
};

// Create a PDF document
const pdfDoc = pdfPrinter.createPdfKitDocument(documentDefinition);

// Pipe the PDF to a writable stream or save it to a file
const pdfStream = fs.createWriteStream('output.pdf');
pdfDoc.pipe(pdfStream);
pdfDoc.end();

console.log('PDF generated successfully.');
