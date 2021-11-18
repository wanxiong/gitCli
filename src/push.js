const ora = require('ora');
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execSync, getGitFile, createGitFile, getHeadBranch } from './utils/index'
import { initAccount } from './utils/jiraAccount'
import { typeList, scopes, defaultBoard } from './utils/constants'

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

const getSformData = (data, name, isAll, otherBoard) => {
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

        if(isAll) {
            otherList = list;
            myselfparentObj = parentObj
        }

        // 子任务存在别人的父任务当中
        otherList.forEach((item) => {
            const parentId = item.parentId;
            // 父任务不是自己创建的
            if (parentObj[parentId] && parentObj[parentId].assignee !== name) {
                myselfparentObj[parentObj[parentId].id] = parentObj[parentId]
            }
        })

        Object.values(myselfparentObj).forEach(item => {
            let str =  `${item.key}-${item.assigneeName}（父任务）${item.summary.slice(0, 40)}`
            perfect.push({
                value: item.key,
                name: str
            })
            otherList.forEach((subItem) => {
                if (subItem.parentId === item.id) {
                    perfect.push({
                        value: subItem.key,
                        name: `--- ${subItem.key}-${subItem.assigneeName}（子任务）${subItem.summary.slice(0, 40)}`
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


const push = async (action, d) => {
    const {designatedBoard, allData} = d
    const fileData = await getGitFile()
    let data = {}
    const branchName = getHeadBranch()
    // 存在过期时间
    if (fileData.expirationTime && fileData.startTime) {
        const nowData = +new Date()
        if(nowData - Number(fileData.startTime) > Number(fileData.expirationTime)) {
            // 重新获取
            data = await writeData(fileData, data)
        } else {
            // 缓存中获取
            data = fileData.baseData
        }
    } else {
        data = await writeData(fileData, data)
    }
    // 执行交互命令选择获取的内容
    const sformData = getSformData(data, fileData.name, allData, designatedBoard)
    const ownList = sformData.perfect
    // 本次提交属于新增还是啥
    let pre = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'preType',
        message: '请选择更改类型（回车确认）',
        choices: typeList,
        pageSize: 10
    }])
    // 修改涉及到的模块
    let moduleType = await inquirer.prompt([{
        type: 'checkbox', 
        name: 'moduleType',
        message: '请选择模块范围（空格选中、可回车跳过）',
        choices: scopes,
        pageSize: 20
    }])
    // 本次对应的sform Id
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
    // 提交文案
    let commitMessage = await inquirer.prompt([{
        type: 'input', 
        name: 'commitText',
        message: '请输入提交的备注信息',
    }])
    console.log(moduleType.moduleType)
    // release(mdm-antd, mdm-creator): sform-4118 xxxxx
    const completeText = `${pre.preType}${moduleType.moduleType.lenght ? `(${moduleType.moduleType})` : ''}: ${formAnswer.sformType} ${commitMessage.commitText}`
    
    console.log(chalk.blue('commit文案：' + completeText))
    const gitAddStr = '自定义';
    const gitAuto = '一键自动添加、提交、推送'
    // 添加暂缓命令
    let gitAddType = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'addType',
        message: '请选择添加命令（如何将文件添加到暂存区）',
        choices: [
            'git add *',
            'git add ./src',
            gitAddStr,
            gitAuto
        ]
    }])
    if (gitAddType.addType === gitAddStr) {
        // 自定义添加
        let customCommit = await inquirer.prompt([{
            type: 'input', 
            name: 'cusCommit',
            message: '请输入git命令将文件添加到暂存区',
            default: 'git add *'
        }])
         // 默认添加 执行添加
        execSync(customCommit.cusCommit)
    } else if (gitAddType.addType === gitAuto) {
        // 一键自动化
        // 默认添加 执行添加
        execSync('git add *')
        execSync(`git commit -m "${completeText}"`)
        execSync('git push origin ' + branchName)
        return
    } else {
        // 默认添加 执行添加
        execSync(gitAddType.addType)
    }
    // 获取commit文案
    execSync(`git commit -m "${completeText}"`)
    const gitPushStr = '自定义';
    let gitPushType = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'pushType',
        message: '请选择提交命令（提交到远程哪个分支）',
        choices: [
            `git push origin ` + branchName,
            '自定义',
        ]
    }])
    // 推送远程
    if (gitPushType.pushType !== gitPushStr) {
        // 默认添加 执行添加
        execSync(gitPushType.pushType) 
        return
    } else {
        let customCommit = await inquirer.prompt([{
            type: 'input', 
            name: 'cusPush',
            message: '请输入git命令将文件推送到远程具体分支',
            default: 'git push orign ' + branchName
        }])
        execSync(customCommit.cusPush)
    }
}

module.exports = push