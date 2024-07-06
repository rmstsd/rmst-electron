const axios = require('axios')
const path = require('path')
const fse = require('fs-extra')

const FormData = require('form-data')
const { HttpsProxyAgent } = require('https-proxy-agent')

const proxy = 'http://127.0.0.1:7890'
const ag = new HttpsProxyAgent(proxy)

upload()
function upload() {
  const dir = path.join(__dirname, 'dist')
  const filesName = fse.readdirSync(dir).filter(item => fse.statSync(path.join(dir, item)).isFile())

  const formData = new FormData()

  const pkg = fse.readJSONSync('./package.json')
  formData.append('version', '8.99')

  formData.append('latest.yml', fse.createReadStream(path.join(dir, 'latest.yml')))
  // filesName.forEach(item => {
  //   formData.append(item, fse.createReadStream(path.join(dir, item)))
  // })

  const isDev = false
  const baseURL = isDev ? 'http://localhost:1666' : 'https://rmst-server.vercel.app'
  const ins = axios.create({ baseURL, httpsAgent: ag })

  console.log('-- send')

  // ins
  //   .get('/')
  //   .then(res => {
  //     console.log('-- then 首页', res.data)
  //   })
  //   .catch(err => {
  //     console.log('-- err 首页', err)
  //   })

  ins
    .post('/uploadFile', formData, { httpsAgent: ag })
    .then(res => {
      console.log('-- then', res.data)
    })
    .catch(err => {
      console.log('-- err', err)
    })
}
