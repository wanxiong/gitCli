// 详情参考angular规范模板
const commitTemplate = `*{{#if subject}}\n  {{~subject}}\n{{~else}}\n  {{~header}}\n{{~/if}}\n\n`

// subject: 'SFORM-3693,SFORM-3694 测试',
const reg = /(sform([-|_]{0,1}[0-9]+,{0,1}))+/i
const verReg = /alpha|beta/g
/** 
 * 提取commit中不包含sform的内容
 */ 
function replaceSubject (text) {
    let trimText = text.trim()
    let newText = trimText.replace(reg, '').trim()
    return newText ? newText : '--'
}

function isAlpha (version) {
    return verReg.test(version)
}


function ignoreEmpty(commit, context) {
    // 过滤 alpha 或 beta版本
    if (isAlpha(context.version)) return
    commit.subject = replaceSubject(commit.subject)
    return commit
}

module.exports = {
    writerOpts: {
        transform: (commit, context) => { 
            if (commit.type === 'feat') {
                commit.type = '✨ Features | 新功能'
            } else if (commit.type === 'fix') {
                commit.type = '🐛 Bug Fixes | Bug 修复'
            } else if (commit.type === 'perf') {
                commit.type = '⚡ Performance Improvements | 性能优化'
            } else if (commit.type === 'style') {
                commit.type = '💄 Styles | 样式修改'
            } else if (commit.type === 'perf') {
                commit.type = '⚡️ Performance Improvements | 性能优化'
            } else if (commit.type === 'build') {
                commit.type = '👷 Build | 影响构建系统或外部依赖项的更改'
            } else if (commit.type === 'chore') {
                commit.type = '🎫 Chores | 构建过程或辅助工具的变动'
            } else if (commit.type === 'docs') {
                console.log(commit)
                commit.type = '📝 Documentation | 仅文档更改'
            } else if (commit.type === 'test') {
                commit.type = '✅ Tests | 增加测试或者矫正已存在的测试'
            } else if (commit.type === 'revert' || commit.revert) {
                commit.type = '⏪ Reverts | 回退'
            } else {
                return
            }
            return ignoreEmpty(commit, context)
        },
        commitPartial: commitTemplate
    },
    groupBy: 'type',
    commitGroupsSort: 'title',
}
