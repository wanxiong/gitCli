
import chalk from 'chalk';
import { getGitFile } from './utils/index'

const config = async (action, ...params) => {
    const [control, type, v] = params
    if(!(control === 'set' || control === 'get')) {
        console.log(chalk.red('命令参数不对或者参数丢失'))
        return
    }
    if( !(type === 'name' || type === 'password')) {
        console.log(2)
        console.log(chalk.red('命令参数不对或者参数丢失'))
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