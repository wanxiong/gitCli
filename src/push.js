const ora = require('ora');
import inquirer from 'inquirer';
import chalk from 'chalk';
import { execSync, getGitFile, getHeadBranch, getJiraData, getLocalConfigFile } from './utils/index'
import { typeList, scopes, configFileName } from './utils/constants'

export const getSformData = (data, name, isAll, otherBoard) => {
    let parentObj = {}
    let list = []
    let myselfparentObj = {}
    let otherList = []
    let perfect = []

    if (data.issuesData && data.issuesData.issues) {
        let arr = data.issuesData.issues.slice(0, 50);
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
        

    } else {
        throw new Error(chalk.bgRed('当前看板' + otherBoard +'的数据不存在'))
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
    const localConfig = await getLocalConfigFile(process.cwd(), configFileName);
    const fileData = await getGitFile()
    let data = {}
    const branchName = getHeadBranch(process.cwd())
    // 存在过期时间
    data = await getJiraData(fileData, designatedBoard, localConfig)
    // 执行交互命令选择获取的内容
    const sformData = getSformData(data, fileData.name, allData || localConfig.lookAll, designatedBoard)
    const ownList = sformData.perfect
    if (!ownList.length) {
        console.log(chalk.redBright('看板类型 ' + fileData.boardType + ' 数据为空,请确认账户 ' + fileData.name + ' 是否没有数据'))
    }
    ownList.unshift({
        value: 'skip',
        name: `跳过`
    })
    // 本次提交属于新增还是啥
    let pre = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'preType',
        message: '请选择更改类型（回车确认）',
        choices: typeList.concat(localConfig.typeList || []),
        pageSize: 10
    }])
    // 修改涉及到的模块
    let moduleType = await inquirer.prompt([{
        type: 'checkbox', 
        name: 'moduleType',
        message: '请选择模块范围（空格选中、可回车跳过）',
        choices: scopes.concat(localConfig.scopes || []),
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
    const moduleTypeStr = moduleType.moduleType.length ? `(${moduleType.moduleType.toString()})` : ''
    // release(mdm-antd, mdm-creator): sform-4118 xxxxx
    const completeText = `${pre.preType}${moduleTypeStr}: ${formAnswer.sformType.includes('skip') ? '' : formAnswer.sformType} ${commitMessage.commitText}`
    // console.log(chalk.green('\n最终提交文案：' + completeText + '\n'))
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
        ].filter((text) => {
            if (action === 'commit' && text === gitAuto) return false;
            return true
        })
    }])

    let ignoreCommitType = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'ignoreCommit',
        message: '提交是否跳过commit相关的husky校验',
        choices: ['是','否'],
        default: '是'
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
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright(customCommit.cusCommit))
        execSync(customCommit.cusCommit)
    } else if (gitAddType.addType === gitAuto) {
        // 一键自动化
        // 默认添加 执行添加
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright('git add *'))
        execSync('git add *')
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright(`git commit -m "${completeText}" ${ignoreCommitType.ignoreCommit === '是' ? '--no-verify': ''}`))
        execSync(`git commit -m "${completeText}" ${ignoreCommitType.ignoreCommit === '是' ? '--no-verify': ''}`)
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright('git pull'))
        execSync('git pull')
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright('git push origin ' + `${branchName}`))
        execSync('git push origin ' + `${branchName}`)
        return
    } else {
        // 默认添加 执行添加
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright(gitAddType.addType))
        execSync(gitAddType.addType)
    }
    // 获取commit文案
    console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright(`git commit -m "${completeText}" ${ignoreCommitType.ignoreCommit === '是' ? '--no-verify': ''}`))
    execSync(`git commit -m "${completeText}" ${ignoreCommitType.ignoreCommit === '是' ? '--no-verify': ''}`)
    if (action === 'commit') {
        return
    }

    const gitPushStr = '自定义';
    let gitPushType = await inquirer.prompt([{
        type: 'rawlist', 
        name: 'pushType',
        message: '请选择提交命令（提交到远程哪个分支）',
        choices: [
            `git push origin ` + `${branchName}`,
            '自定义',
        ]
    }])

    // 推送远程
    if (gitPushType.pushType !== gitPushStr) {
        // 默认添加 执行添加
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright('git pull'))
        execSync('git pull')
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright(gitPushType.pushType))
        execSync('git push origin feature/3.2.19_SFORM_3678') 
        return
    } else {
        let customCommit = await inquirer.prompt([{
            type: 'input', 
            name: 'cusPush',
            message: '请输入git命令将文件推送到远程具体分支',
            default: 'git push orign ' + `${branchName}`
        }])
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright('git pull'))
        execSync('git pull')
        console.log(chalk.yellowBright('执行命令：'), chalk.cyanBright(customCommit.cusPush))
        execSync(customCommit.cusPush)
    }
}

export default push