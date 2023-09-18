const puppeteer = require('puppeteer');
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
  const browser = await puppeteer.launch({
    // headless: true
  });



  // console.log(userData.imageURL)
  // https://blog.logrocket.com/managing-pdfs-node-pdf-lib/
  const template = fs.readFileSync(path.join(__dirname, './static/profile.ejs'), 'utf8');
  const start = Date.now()
  const html = ejs.render(template, userData);
  const ejsEndTime = Date.now()
  // console.log('EJSRenderTime : ', ejsEndTime - start)
  // const html2 = ejs.render(html, {
  //   imageURL: 'https://cdn.pixabay.com/photo/2015/09/16/08/55/online-942406_960_720.jpg'
  // })

  const page = await browser.newPage();
  // await page.addScriptTag({ path: './ej2.min.js' })
  // console.log('page : ', page)
  // Set the content to the rendered HTML
  await page.setContent(html);
  await page.pdf({ path: `./pdf/profile_${i}.pdf`, format: 'A4' });
  const end = Date.now()
  // await page.addStyleTag({
  //   path: path.join(__dirname, './static/style.css')
  // })

  // await page.pdf({ path: 'profile_5.pdf' });
  // sleep.msleep(5000)
  // console.log('pageWithContent : ', page)
  // Generate a PDF

  await browser.close();
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