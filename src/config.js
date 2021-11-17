// import ora from 'ora';
import inquirer from 'inquirer';
import fs from 'fs';
import chalk from 'chalk';
import path from 'path'
import { pathUrl } from './utils/constants'
import { execSync, getGitFile } from './utils/index'
// 创建git账号文件



const config = async (action, ...params) => {
    const [control, type, v] = params
    if(!(control === 'set' || control === 'get')) {
        console.log(chalk.red('命令参数不对'))
        return
    }
    if( !(type === 'name' || type === 'password')) {
        console.log(2)
        console.log(chalk.red('命令参数不对'))
        return
    }
    if (control === 'get' && (type === 'name' || type === 'password')) {
        let json = await getGitFile()
        console.log(type + '：' +json[type])
    }
    if (control === 'set' && (type === 'name' || type === 'password') && v) {
        let json = await getGitFile()
        json[type] = v
        console.log(type + '：' +json[type])
    }
}

module.exports = config