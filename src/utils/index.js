
import fs from 'fs';
import path from 'path'
import { pathUrl } from './constants'
import chalk from 'chalk';
import childProcess from 'child_process';
import ora from 'ora'
import { initAccount } from './jiraAccount'

const spinner = ora('Loading')

export async function getGitFile  () {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, '../', pathUrl), 'utf-8', (err, data) => {
            if (err) {
                console.log(chalk.red('初始化文件错误，请重新初始化命令 <mdmCommit init>'))
                throw err;
            }
            resolve(JSON.parse(data))
        })
    })
    
}

export async function createGitFile (data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path.resolve(__dirname, '../', pathUrl), JSON.stringify(data, null, '\t'),
        {},
        (err) => {
            if (err) {
                throw err;
            }
            // console.log('文件写入成功')
            resolve()
        })
    })
    
}

export function execSync(cmd, stdio, cwd) {
    if (!cwd) cwd = process.cwd();
    if (!stdio) stdio = 'inherit';
    try {
        const res = childProcess.execSync(cmd, { stdio, encoding: 'utf8', cwd });
        if (res) return res.toString().trim();
        return res
    } catch (error) {
        // console.log(error)
        // 1的时候commit 没有变更
        if (error.status !== 1) {
            throw new Error(chalk.bgRed('异常中断code=' + error.status + '\n' + error)) 
        }
        return null
    }
}


/** 获取本地分支名 */
export function getHeadBranch() {
    const baseDir = process.cwd()
    const head = fs.readFileSync(path.resolve(baseDir, './.git/HEAD'), { encoding: 'utf-8' });
    let branch = head.split('refs/heads/')[1];
    if (!branch) {
        // exec 速度比较慢
        branch = execSync('git rev-parse --abbrev-ref HEAD', 'pipe');
    }

    return branch.trim();
}

// 连接jira账号并获取对应的数据 && 写入文件
export const writeData = async (fileData, designatedBoard) => {
    spinner.color = 'yellow';
    spinner.start('获取关联的jira账号');
    try {
        const data = await initAccount({
            name: fileData.name,
            password: fileData.password,
            delay: 2000,
            designatedBoard: designatedBoard || defaultBoard
        })
        fileData.baseData = data
        // 2小时过期
        fileData.expirationTime = 7200 * 1000
        fileData.startTime = +new Date()
        fileData.boardType = designatedBoard;
        await createGitFile(fileData)
        spinner.succeed('获取jira账号成功')
        return data
    } catch (error) {
        spinner.stop(chalk.red('异常终止获取jira数据'))
        throw new Error(error)
    }
    
}
