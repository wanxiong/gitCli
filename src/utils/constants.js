export const VERSION = "1.3.5"
export const pathUrl = 'baseConfig.json'
export const defaultBoard = 'SFORM Sprint'
export const configFileName = 'mdm-git.config.json'
export const BoardBug = 'bug'
export const typeList = [
    {
        value: 'feat',
        name: 'feat: 增加新功能（feature）',
      },
      {
        value: 'fix',
        name: 'fix: 修补bug',
      },
      {
        value: 'refactor',
        name: 'refactor: 重构（即不是新增功能，也不是修改bug的代码变动）',
      },
      {
        value: 'docs',
        name: 'docs: 对文档进行了修改',
      },
      {
        value: 'test',
        name: 'test: 增加确实的测试或者矫正已存在的测试',
      },
      {
        value: 'chore',
        name: 'chore: 构建过程或辅助工具的变动（构建流程, 依赖管理）',
      },
      {
        value: 'style',
        name: 'style: 不影响代码含义的修改，比如空格、格式化、缺失的分号等（注意不是 css 修改）',
      },
      {
        value: 'release',
        name: 'release: 发布版本',
      },
      {
        value: 'perf',
        name: 'perf: 优化相关，比如提升性能、体验',
      }
]


export const scopes = [
  { name: 'mdm-antd'},
  { name: 'mdm-antd-mobile'},
  { name: 'mdm-creator'},
  { name: 'mdm-stager'},
  { name: 'mdm-utils' },
  { name: 'mdm-component-shared'  },
  { name: 'mdm-search-table'  },
  { name: 'form-antd' },
  { name: 'form-antd-mobile'  },
  { name: 'form-core' },
  { name: 'form-react' },
  { name: 'form-request'  },
  { name: 'form-stager'  },
  { name: 'ethunder' },
  { name: 'pms' },
]