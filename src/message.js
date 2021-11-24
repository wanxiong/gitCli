const ora = require('ora');
import inquirer from 'inquirer';
import chalk from 'chalk';
import { getGitFile, writeData, getJiraData } from './utils/index'
import { typeList, scopes } from './utils/constants'
import { getSformData } from './push'

const message = async (action, d) => {
    const {designatedBoard, allData} = d
    const fileData = await getGitFile()
    let data = {}
    // 存在过期时间
    data = await getJiraData(fileData, designatedBoard)
    // 执行交互命令选择获取的内容
    const sformData = getSformData(data, fileData.name, allData, designatedBoard)
    const ownList = sformData.perfect
    if (!ownList.length) {
        console.log(chalk.redBright('看板类型 ' + fileData.boardType + ' 数据为空,请确认账户 ' + fileData.name + ' 是否没有数据'))
        // throw new Error(chalk.red('看板类型 ' + fileData.boardType + ' 数据为空,请确认账户 ' + fileData.name + ' 是否没有数据'))
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
    // release(mdm-antd, mdm-creator): sform-4118 xxxxx
    const completeText = `${pre.preType}${moduleType.moduleType.lenght ? `(${moduleType.moduleType})` : ''}: ${formAnswer.sformType === 'skip' ? '' : formAnswer.sformType} ${commitMessage.commitText}`
    
    console.log(chalk.yellowBright('\n请拷贝(最终提交文案)：'), chalk.greenBright(completeText + '\n'))
}

module.exports = message