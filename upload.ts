import axios from 'axios'

import * as path from 'node:path'
import * as fse from 'fs-extra'
import * as fs from 'node:fs'
import * as FormData from 'form-data'

upload()

function upload() {
  const dir = path.join(__dirname, 'dist')
  const filesName = fse.readdirSync(dir).filter(item => fse.statSync(path.join(dir, item)).isFile())

  const formData = new FormData()

  const pkg = fse.readJSONSync('./package.json')
  formData.append('version', pkg.version)

  filesName.forEach(item => {
    formData.append(item, fs.createReadStream(path.join(dir, item)))
  })

  console.log('formData', formData)

  axios({
    url: 'http://127.0.0.1:1666/uploadFile',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => {
    // console.log(res.data)
  })
}
