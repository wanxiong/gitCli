
import fs from 'fs';
import path from 'path'
import { pathUrl, defaultBoard } from './constants'
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
export function getHeadBranch(cwd) {
    let file = findConfigFile(cwd, './.git/HEAD')
    const baseDir = process.cwd()
    let head = null
    if (file.hasFile) {
        head = fs.readFileSync(file.url, { encoding: 'utf-8' });
    } else {
        head = fs.readFileSync(path.resolve(baseDir, './.git/HEAD'), { encoding: 'utf-8' });
    }
    let branch = head.split('refs/heads/')[1];
    if (!branch) {
        // exec 速度比较慢
        branch = execSync('git rev-parse --abbrev-ref HEAD', 'pipe');
    }

    return branch.trim();
}

// 连接jira账号并获取对应的数据 && 写入文件
export const writeData = async (fileData, designatedBoard, localConfig) => {
    spinner.color = 'yellow';
    spinner.start('获取关联的jira账号');
    try {
        const data = await initAccount({
            name: fileData.name,
            password: fileData.password,
            delay: 2000,
            designatedBoard: designatedBoard || localConfig.Board || defaultBoard
        })
        fileData.baseData = data
        // 2小时过期
        fileData.expirationTime = 7200 * 1000
        fileData.startTime = +new Date()
        fileData.boardType = designatedBoard || localConfig.Board || defaultBoard;
        await createGitFile(fileData)
        spinner.succeed('获取jira账号成功')
        return data
    } catch (error) {
        spinner.stop(chalk.red('异常终止获取jira数据'))
        throw new Error(error)
    }
    
}

/**
 * 
*/
export const getJiraData = async (fileData, designatedBoard, localConfig = {}) => {
    let data = null
    // 存在过期时间
    if (fileData.expirationTime && fileData.startTime) {
        if (designatedBoard === fileData.boardType) { // 看板类型相同 直接读取输
            const nowData = +new Date()
            if(nowData - Number(fileData.startTime) > Number(fileData.expirationTime)) {
                // 重新获取
                console.log(chalk.greenBright('重新获取jira信息...'))
                data = await writeData(fileData, designatedBoard, localConfig)
            } else {
                // 缓存中获取
                console.log(chalk.greenBright('从缓存中获取jira信息...'))
                data = fileData.baseData
            }
        } else { // 需要重新获取
            console.log(chalk.greenBright('看板模块切换，重新获取jira信息...'))
            data = await writeData(fileData, designatedBoard, localConfig)
        }
    } else {
        console.log(chalk.greenBright('初次获取jira信息...'))
        data = await writeData(fileData, designatedBoard, localConfig)
    }
    return data
} 

// 查找指定文件是否存在
export function findConfigFile (dirname, fileName) {
    let basePath = '../'
    let maxLevel = 5
    let index = 0
    let d = false
    let url = ''
    while(!d && index < maxLevel) {
        const arr = []
        for (let i = 0; i < index; i++) {
            arr.push(basePath)
        }
        url = path.resolve(dirname, arr.join(''), fileName)
        index++
        d = fs.existsSync(url)
    }
    return {
        hasFile: d,
        url
    }
}

// 获取本地文件
export async function getLocalConfigFile (dirname, fileName) {
    let file = findConfigFile(dirname, fileName)
    if (file.hasFile) {
        let d = await new Promise((resolve, reject) => {
            fs.readFile(file.url, 'utf-8', (err, data) => {
                if (err) {
                    console.log(chalk.red('初始化文件错误，请重新初始化命令 <mdmCommit init>'))
                    throw err;
                }
                try {
                    resolve(JSON.parse(data))
                } catch (error) {
                    resolve({})
                }
            })
        })
        return d
    }
    return {}
}
