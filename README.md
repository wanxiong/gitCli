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

// 查看bug或所有任务
mdmGit push -d 'bug'

```

- 推送并提交代码，jira账号对应看板是否可以看到所有人的任务（默认：false）
```js
mdmGit push -a [option]
// 案例指定看板
mdmGit push -a true
```

- 当你只需要提交文案的时候，你可以这样
```js
// 获取自定义提交文案
mdmGit message
```
# 验证是否成功
mdmGit --help


# 说明
`.git`查找文件是根据指令运行时的环境环境路径查找，请确保当前运行目录存在`.git`文件

暂不支持cwd传入



### 项目下可新建配置文件`mdm-git.config.json`,内容如下
```json
{
    "typeList": [{
        "value": "feat1",
        "name": "feat1: 增加新功能（feature）"
      }],
    "scopes": [{
        "name": "新增123"
    }],
    "Board": "SFORM Sprint",
    "lookAll": false
}
```

### `mdm-git.config.json`
| 参数名    | 说明                                      | 是否必填 |       类型        |  默认值  |
| :-------- | :--------------------------------------   | :---------------: | :---------------: |:------: |
| typeList  | 当前分支的功能                            | 非必填      |  `Array<typeItem>` |  []  |
| scopes    | 修改代码影响的模块                        | 非必填      |    `Array<scopeItem>` |  []  |
| Board     | jira看板的类型                             | 非必填      |   string |  SFORM Sprint  |
| lookAll   | 查看当前看板下的所有任务                   | 非必填      |   boolean |  仅看当前账户  |

### **typeItem**
| 参数名    | 说明                                      | 是否必填 |       类型        |  默认值  |
| :-------- | :--------------------------------------   | :---------------: | :---------------: |:------: |
| value     | 提交时候的value                           | 必填      |  string |  无  |
| name      | 显示在交互界面的选择文案                    | 必填      |   string |  无  |

### **scopeItem**
| 参数名    | 说明                                      | 是否必填 |       类型        |  默认值  |
| :-------- | :--------------------------------------   | :---------------: | :---------------: |:------: |
| name      | 修改的模块                                | 必填      | string |  无  |