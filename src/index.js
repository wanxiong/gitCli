import chalk from 'chalk';
import init from './init'
import config from './config'
import push from './push'
import { execSync } from './utils/index'

function apply (action, d, ...params) {
    switch (action) {
        case 'init': 
            //配置
            init(action)
            break;
        case 'config': 
            //配置
            config(action, ...params)
            break;
        case 'push': 
            //配置
            execSync('git commit ./')
            return
            push(action, d,...params)
            break;
        case 'commit': 
            //配置
            push(action, d,...params)
            break;
        default:
            chalk.red(`${action}命令不存在`)
            break;
    }
}


module.exports = apply;