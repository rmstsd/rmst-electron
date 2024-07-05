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

  formData.append('asd', fs.createReadStream(path.join(__dirname, './upload.ts')))

  filesName.forEach(item => {
    // formData.append(item, fs.createReadStream(path.join(dir, item)))
  })

  const isDev = false

  const Prod = isDev ? 'http://localhost:1666' : 'https://rmst-server.vercel.app'

  const ins = axios.create({ baseURL: Prod })

  ins.post('/uploadFile', formData).then(res => {
    console.log('-- then', res.data)
  })
}
