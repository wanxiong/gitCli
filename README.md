# gitCli
git 提交小工具
# 全局安装
```js
npm i -g mdm-git-cli
```

# 初始化jira账号(必须)
```js
mdmGit init
```
## 使用



- 只提交不推送
```js
mdmGit commit
```

- 推送并提交
```js
mdmGit push
```

- 推送并提交代码，jira账号指定指定看板的模块（默认：'SFORM Sprint'）
```js
mdmGit push -d [option]
// 案例指定看板
mdmGit push -d 'SFORM Sprint'
```

- 推送并提交代码，jira账号对应看板是否可以看到所有人的任务（默认：false）
```js
mdmGit push -a [option]
// 案例指定看板
mdmGit push -a true
```
# 验证是否成功
mdmGit --help