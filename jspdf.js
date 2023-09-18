const { jsPDF } = require('jspdf');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const addToJSON = require('./calculator');
require('dotenv').config()


const userData = {
  name: 'Shubham',
  age: 21,
  email: 'shubham@gmail.com',
  mobile: '9878653432',
  heading: 'My PDF Creator',
  version: '1.0.0',
  // imageURL: ''
  // imageURL: path.join(__dirname, './static/user.jpeg')
  imageURL: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg',
  // imageURL: './user.jpeg'
  // Add more user data as needed
};

let times = process.env.COUNT || 1
let result = []

async function generatePDF(i) {
  const doc = new jsPDF()

  const template = fs.readFileSync(path.join(__dirname, './static/profile.html'), 'utf8');
  const start = Date.now()
  const document = ejs.render(template, userData);
  const ejsEndTime = Date.now()

  console.log("html : ", html)

  doc.html(document)
  doc.output(`./pdf/profile_jspdf.pdf`)
  const end = Date.now()

  let renderTime = ejsEndTime - start
  let compileTime = end - ejsEndTime
  let totalTime = end - start

  console.log('EJSRenderTime : ', renderTime, "ConvertHTMLTOPDF: ", compileTime, " TotalTime: ", totalTime)
  result.push({
    renderTime,
    compileTime,
    totalTime
  })
  // addToJSON({
  //   renderTime,
  //   compileTime,
  //   totalTime
  // })
}

const interval = setInterval(() => {
  if (result.length === parseInt(times)) {
    let max = 0, min = null, total = 0;

    result.map((data) => {
      max = Math.max(data.totalTime, max)
      if (min === null) {
        min = data.totalTime
      } else {
        max = Math.max(data.totalTime, max)
      }

      total += data.totalTime
    })

    addToJSON({
      'data': result,
      'Max': max,
      'Min': min,
      'total': total,
      'count': parseInt(times)
    })
    result = []
    clearInterval(interval)
  }
}, 1000);

function main() {

  for (let i = 0; i < times; i++) {
    generatePDF(i)
  }
}

main()