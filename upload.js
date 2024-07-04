const axios = require('axios')
const path = require('path')
const fse = require('fs')

const FormData = require('form-data')
console.log(FormData)

upload()
function upload() {
  const dir = path.join(__dirname, 'dist')
  const filesName = fse.readdirSync(dir).filter(item => fse.statSync(path.join(dir, item)).isFile())

  const formData = new FormData()

  // const pkg = fse.readJSONSync('./package.json')
  formData.append('version', '8.99')

  filesName.forEach(item => {
    formData.append(item, fse.createReadStream(path.join(dir, item)))
  })

  axios({
    url: 'http://127.0.0.1:3111/uploadFile',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    // console.log(res.data)
  })
}
