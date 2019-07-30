import downloadGit from 'download-git-repo'
import ora from 'ora'
import path from 'path'

export default (projectName, url) => {
  let loading = ora(`正在下载项目模板`)
  projectName = path.join('./download-temp')
  loading.start()
  return new Promise((resolve, reject) => {
    downloadGit(`direct:${url}`, projectName, { clone: true }, (err) => {
      if (err) {
        loading.fail()
        reject(err)
      } else {
        loading.succeed()
        resolve(projectName)
      }
    })
  })
}