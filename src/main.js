import program from 'commander'
import path from 'path'
import fs from 'fs'
import logSymbols from 'log-symbols'
import chalk from 'chalk'
import inquirer from 'inquirer'
import latestVersion from 'latest-version'
import { spawn } from 'child_process'
import { sync as rm } from 'rimraf'
import ora from 'ora'

import templateConfig from './config/template.json'
import configDefalut from './config/index'
import downloadLocal from './lib/download'
import generator from './lib/generator'

program.usage("<project-name>").parse(process.argv);

// 根据输入的获取项目名称
let projectName = program.args[0]
if (!projectName) {
  // 如果没有输入就执行help命令
  program.help()
}

// 获取当前的工作目录
let rootName = path.basename(process.cwd())

// 项目初始化
main()

/**
 * 主进程
 */
async function main() {
  try {
    let isUpdate = await checkVersion() // 检查版本更新
    if (isUpdate) await updateCli() // 更新脚手架
    // console.log("判断是否存在目录")
    await checkDir() // 检查路径
    let git = await selectTemplate() // 选择模板
    let templateName = await downloadLocal(projectName, git) // 下载模板
    let customizePrompt = await getCustomizePrompt(templateName, "customize_prompt.js")
    await render(projectName, templateName, customizePrompt)
    build()
  } catch (error) {
    console.log(logSymbols.error, chalk.red(`创建失败: ${error}`))
  }
}

// 检查版本
function checkVersion() {
  return new Promise(async (resolve, reject) => {
    console.log('\r')
    const spinner = ora('检查zone-cli版本中')
    spinner.start();
    let cliVersion = await latestVersion("zone-cli")
    let localVersion = require('../package.json').version
    // console.log(`本地版本${localVersion}, 最新版本${cliVersion}`)
    let cliVersionArr = cliVersion.split('.')
    let localVersionArr = localVersion.split('.')
    let isNew = cliVersionArr.some((item, index) => {
      return Number(item) > Number(localVersionArr[index])
    })
    if (!isNew) {
      spinner.succeed()
      console.log(`\r\nzone-cli是最新的\r\n`)
    }
    resolve(isNew)
  })
}

// 更新脚手架
function updateCli() {
  return new Promise(async resolve => {
    console.log(logSymbols.warning, chalk.green(`有新版本,请更新`))
    const promptArr = configDefalut.updateNPMPrompt
    let { npmType } = await inquirer.prompt(promptArr)
    const spinner = ora('更新zone-cli中 ')
    let status
    switch (npmType) {
      case "npm":
        spinner.start();
        status = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ["install", "zone-cli", "-g"])
        break;
      case "cnpm":
        spinner.start();
        status = spawn(/^win/.test(process.platform) ? 'cnpm.cmd' : 'cnpm', ["install", "zone-cli", "-g"])
        break;
      case "yarn":
        spinner.start();
        status = spawn(/^win/.test(process.platform) ? 'yarn.cmd' : 'yarn', ["add", "zone-cli", "-g"])
        break;
    }
    status.stdout.on("data", data => {
      console.log(data.toString());
    })
    status.on("close", () => {
      spinner.succeed()
      console.log(logSymbols.success, chalk.green("更新成功"))
      resolve()
    })
  })
}

// 检查目录是否存在
function checkDir() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(projectName)) {
      fs.mkdirSync(projectName)
      resolve()
    } else {
      let config = {
        type: 'confirm',
        message: '已经存在目录了,是否要删除该目录?',
        name: "watch"
      }
      inquirer.prompt(config).then(res => {
        if (res.watch) {
          rm(projectName)
          fs.mkdirSync(projectName)
          console.log('\r')
          resolve()
        } else {
          // 项目已经存在
          // console.log(logSymbols.error, chalk.red(`项目${projectName}已经存在`))
          reject(`项目${projectName}已经存在`)
        }
      })
    }
  })
}

// 选择模板
function selectTemplate() {
  return new Promise((resolve, reject) => {
      let choices = Object.values(templateConfig).map(item => {
        return {
          name: item.name,
          value: item.value
        }
      })
      let config = {
        type: 'list',
        message: '请选择创建的项目类型\n',
        name: 'select',
        choices: [...choices]
      }
      inquirer.prompt(config).then(res => {
        let { select } = res
        let { value, git } = templateConfig[select]
        resolve(git)
      })
  })
}

// 读取配置文件
function getCustomizePrompt(templateName, fileName) {
  return new Promise((resolve) => {
    const filePath = path.join(process.cwd(), templateName, fileName)
    if (fs.existsSync(filePath)) {
      // console.log('读取模板配置文件')
      let file = require(filePath)
      resolve(file)
    } else {
      // console.log('该文件没有配置文件')
      resolve([])
    }
  })
}

// 渲染模板
function render(projectName, templateName, customizePrompt) {
  return new Promise(async (resolve, reject) => {
    try {
      let context = {
        name: projectName,
        root: projectName,
        downloadTemp: templateName
      }
      const promptArr = configDefalut.getDefaultPrompt(context)
      promptArr.push(...customizePrompt)
      let answer = await inquirer.prompt(promptArr)
      let generatorParam = {
        metadata: {
          ...answer
        },
        src: context.downloadTemp,
        dest: context.root
      }
      await generator(generatorParam)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

// 提示
function build() {
  console.log('\r')
  console.log(logSymbols.success, chalk.green(`执行 cd ${projectName}`))
  console.log(logSymbols.success, chalk.green(`安装依赖 三选一`))
  console.log(logSymbols.success, chalk.green(`npm install`))
  console.log(logSymbols.success, chalk.green(`cnpm install`))
  console.log(logSymbols.success, chalk.green(`yard install`), '\n')
}