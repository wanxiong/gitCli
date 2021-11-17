const ora = require('ora');
import inquirer from 'inquirer';
import fs from 'fs';
import chalk from 'chalk';
// import ora from 'ora'
import { execSync, getGitFile, createGitFile } from './utils/index'
import { initAccount } from './utils/jiraAccount'
import { typeList, scopes } from './utils/constants'
import { dirname } from 'path';

const spinner = ora('Loading')

// 连接jira账号并获取对应的数据 && 写入文件
const writeData = async (fileData) => {
    spinner.color = 'yellow';
    spinner.start('获取关联的jira账号');
    const data = await initAccount({
        name: fileData.name,
        password: fileData.password,
        delay: 2000
    })
    fileData.baseData = data
    // 2小时过期
    fileData.expirationTime = 7200 * 1000
    fileData.startTime = +new Date()
    await createGitFile(fileData)
    spinner.succeed('获取jira账号成功')
    return data
}

const getSformData = (data, name) => {
    let parentObj = {}
    let list = []
    let myselfparentObj = {}
    let otherList = []
    let perfect = []
    if (data.issuesData && data.issuesData.issues) {
        let arr = data.issuesData.issues;
        for (var i = 0; i < arr.length; i++) {
            if (!arr[i].parentId) {
                // 顶级
                parentObj[arr[i].id] = arr[i]
                if (name === arr[i].assignee) {
                    myselfparentObj[arr[i].id] = arr[i]
                }
            } else {
                if (name === arr[i].assignee) {
                    otherList.push(arr[i])
                }
                list.push(arr[i])
            }
        }

        Object.values(myselfparentObj).forEach(item => {
            let str =  `${item.key}（父任务）${item.summary.slice(0, 40)}`
            perfect.push({
                value: item.key,
                name: str
            })
            otherList.forEach((subItem) => {
                if (subItem.parentId === item.id) {
                    perfect.push({
                        value: subItem.key,
                        name: `--- ${subItem.key}（子任务）${subItem.summary.slice(0, 40)}`
                    })
                }
            })
        })

    }


    return {
        parentObj,
        childrenAllList: list,
        myselfparentObj,
        otherList,
        perfect
    }
}

const push = async (action, ...params) => {
    const [control, type, v] = params
    const fileData = await getGitFile()

    let data = {}
    // 存在过期时间
    if (fileData.expirationTime && fileData.startTime) {
        const nowData = +new Date()
        if(nowData - Number(fileData.startTime) > Number(fileData.expirationTime)) {
            // 重新获取
            // console.log('重新获取')
            data = await writeData(fileData, data)
        } else {
            // console.log('缓存中获取')
            // 缓存中获取
            data = fileData.baseData
        }
    } else {
        data = await writeData(fileData, data)
    }
    // 执行交互命令选择获取的内容
    const sformData = getSformData(data, fileData.name)
    const ownList = sformData.perfect

    let pre = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'preType',
        message: '请选择更改类型',
        choices: typeList,
        pageSize: 10
    }])

    let moduleType = await inquirer.prompt([{
        type: 'checkbox', 
        name: 'moduleType',
        message: '请选择模块范围（可回车跳过）',
        choices: scopes,
        pageSize: 20
    }])

    let formAnswer = await inquirer.prompt([{
        type: 'checkbox', 
        name: 'sformType',
        message: '请选择提交对应的SFORM',
        choices: ownList,
        pageSize: 30,
        validate: function (text) {
            var done = this.async();
            if (!text.length) {
                done(null, false)
            } else {
                done(null, true)
            }
        }
    }])
    let commitMessage = await inquirer.prompt([{
        type: 'input', 
        name: 'commitText',
        message: '请输入提交的备注信息',
    }])
    // release(mdm-antd, mdm-creator): sform-4118 xxxxx
    const completeText = `${pre.preType}${moduleType.moduleType ? `(${moduleType.moduleType})` : ''}: ${formAnswer.sformType} ${commitMessage.commitText}`
    console.log(chalk.blue('commit文案：' + completeText))
    const gitAddStr = 'git add *';
    let gitAddType = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'addType',
        message: '请选择添加命令（如何将文件添加到暂存区）',
        choices: [
            gitAddStr,
            '自定义',
        ]
    }])
    if (gitAddType.addType === gitAddStr) {
         // 默认添加 执行添加
         execSync(gitAddType.addType)
        // 获取commit文案
        execSync(`git commit -m ${completeText}`)
        // 提交文案
        // execSync(`git push`) 
    } else {
        let customCommit = await inquirer.prompt([{
            type: 'input', 
            name: 'cusCommit',
            message: '请输入git命令将文件添加到暂存区',
        }])
         // 默认添加 执行添加
        execSync(customCommit.cusCommit)
        console.log(customCommit.cusCommit)
        execSync(`git commit -m ${completeText}`)
    }
}

module.exports = push