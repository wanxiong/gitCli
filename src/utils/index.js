
import fs from 'fs';
import path from 'path'
import { pathUrl } from './constants'
import spawn from 'cross-spawn';
import chalk from 'chalk';

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
    console.log('cwd====', 123, cwd)
    if (!cwd) cwd = process.cwd();
    if (!stdio) stdio = 'inherit';
    const res = spawn.sync(cmd, { stdio, encoding: 'utf8', cwd,  });
    if (res.status !== 0) {
        throw new Error(chalk.bgRed('异常中断code=' + res.status + '\n' + res.error)) 
    }
    return res
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