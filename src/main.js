import program from 'commander'
import { VERSION, defaultBoard } from './utils/constants'
import apply from './index'

let actionMap = {
    init: {
        alias: 'I', // 别名
        description: '初始化配置', // 描述
        usages: [
            'mdmGit init',
        ]
    },
    config: {
        alias: 'C', // 别名
        description: '设置或者得到邮箱和密码', // 描述
        usages: [
            'mdmGit config set name <val>',
            'mdmGit config set password <val>',
            'mdmGit config get name',
            'mdmGit config get password',
        ]
    },
    push: {
        alias: 'P', // 别名
        description: '提交并推送代码', // 描述
        usages: [
            'mdmGit push',
            'mdmGit push -d [options]',
            'mdmGit push -a',
        ],
        option: [
            ['-d, --designated-board [--designated-doard]', '指定看板的模块', defaultBoard],
            ['-a, --all-data', '看到所有数据', false]
        ]
    },
    commit: {
        alias: 'C', // 别名
        description: '提交代码', // 描述
        usages: [
            'mdmGit commit',
            'mdmGit commit -d [options]',
            'mdmGit commit -a',
        ],
        option: [
            ['-d, --designated-board [--designated-doard]', '指定看板的模块', defaultBoard],
            ['-a, --all-data', '看到所有数据', false]
        ]
    },
}


// 添加 init / config 命令
Object.keys(actionMap).forEach((action) => {
    const command = program.command(action) //配置命令的名字
    .description(actionMap[action].description) // 描述
    .alias(actionMap[action].alias) //别名
    .action((d) => { // 动作
        apply(action, d, ...process.argv.slice(3));
    });
    if (actionMap[action].option) {
        actionMap[action].option.forEach((item) => {
            command.option(...item)
        })
    }
});

//
function help() {
    console.log('\r\nUsage:');
    Object.keys(actionMap).forEach((action) => {
        actionMap[action].usages.forEach(usage => {
            console.log('  - ' + usage);
        });
    });
}
program.usage('<command> [options]');

// eos -h 
program.on('-h', help);
program.on('--help', help);
// eos -V   VERSION 为 package.json 中的版本号
program.version(VERSION, '-V --version').parse(process.argv);