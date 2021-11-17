import inquirer from 'inquirer';
import chalk from 'chalk';
import { createGitFile } from './utils/index'


// 创建git账号文件
const createFile = async (name, password) => {
    await createGitFile({
        name,
        password
    })
    console.log(chalk.green('jira配置文件写入成功'))
}

const init = async (action) => {
    inquirer.prompt([
        {
            type: 'confirm', 
            name: 'isInit',
            message: '是否初始化jira账号'
        },
        
    ]).then(async (answer) => {
        const { isInit } = answer
        isInit && (inquirer.prompt([
            {
                // type: 'list', 
                name: 'name',
                message: '请输入jira账号'
            },
            {
                type: 'password',
                name: 'password',
                message: '请输入jira密码'
            }
        ]).then(async (answer) => {
            const { name, password } = answer
            const nameTrim = name.trim() || ''
            const passwordTrim = password.trim() || ''
            createFile(nameTrim, passwordTrim)
        }))
    })

}

module.exports = init