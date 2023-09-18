//@ts-check
const fs = require('fs')

function addToJSON(data) {
  const output_file = 'output.json'
  let outputjson = fs.readFileSync(output_file, "utf-8");
  if (outputjson === '') {
    outputjson = '[]'
  }
  let result = JSON.parse(outputjson)
  // const note = process.env.NOTE || ''
  // if(note !== ''){
  //   data['note'] = note
  // }
  // console.log("outputFile", result)
  result.push(data)
  fs.writeFileSync(output_file, JSON.stringify(result, null, 2), 'utf-8')

}

module.exports = addToJSON