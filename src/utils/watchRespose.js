import path from 'path'
import { BoardBug }from './constants'
import chalk from 'chalk';
import { cloneDeep } from 'lodash'
/**
 * 看板接口关键字-对应路径： http://jira.taimei.com/secure/Dashboard.jspa
 */
const dashboard = 'issueTable/filter'
/**
 * 对应数据接口
 */
const getListUrl = 'http://jira.taimei.com/rest/greenhopper/1.0/xboard/work/allData.json'
/**
 * 登录接口
 */
const loginUrl = 'http://jira.taimei.com/login.jsp'


const loginFail = '的用户名和密码不正确'

async function toQuestionPage (page) {
    // 得到问题按钮
    const questionBtn = await page.$('#find_link');
    // 点击获取下拉
    await questionBtn.click();
    // 等他渲染 来个1秒钟
    await page.waitForTimeout(1000)
    // 获取面板下拉数据   ----- 面板
    const linkToBtn = await page.$('#filter_lnk_my_lnk')
    linkToBtn.click()
}

// 看板
function dashboardFn (respone, page, account, browser, resolve, reject) {
    Promise.resolve().then(async () => {
        // 等待2秒 跳转需要时间
        // await page.waitForTimeout(account.delay);
         // 得到看板按钮
         const boardBtn = await page.$('#greenhopper_menu');
         await page.screenshot({
            path: path.resolve(__dirname, '../account.png')
         })

         if (account.designatedBoard.trim().toLocaleLowerCase() === BoardBug) {
            // 我未完成的问题
            await toQuestionPage(page)
            return
        } 

        // 点击按钮-看板的
        await boardBtn.click();
        // 获取面板下拉数据   ----- 面板
        const boardList = []
        // 等待2秒 跳转需要时间
        await page.waitForTimeout(1000)
        const linkList = await page.$$('#greenhopper_menu_dropdown_recent .aui-list-truncate li');
        for (var i = 0; i< linkList.length; i++) {
            let data = await linkList[i].$eval('a', el => {
                const href = el.getAttribute('href');
                // 获取所有的信息
                return {
                    originHref: 'http://jira.taimei.com' + href,
                    innerHTML: el.innerHTML,
                    id: el.getAttribute('id')
                }
            })
            boardList.push(data)
        }
        const hasBoard = boardList.filter((item) => {
            const text = item.innerHTML;
            if (text.trim() === account.designatedBoard.trim()) {
                return item
            }
        })
        if (hasBoard.length) {
            let reg = new RegExp("rapidView=([^&?]*)", "ig");
            const mat = reg.exec(hasBoard[0].originHref)
            let str =  mat ? mat[1] : ''
            const params = '?rapidViewId=' + str
            const respone  = await page.goto(getListUrl + params,);
            const jsonData = await respone.json()
            browser.close();
            resolve(jsonData)
        } else {
            throw new Error('你没有相关的看板内容====' + account.designatedBoard.trim() + ',请重新选择看板')
        }

    }).catch((error) => {
        console.log(error)
        browser.close();
        reject(error)
    })
    return respone
}


// 登录接口
export async function  loginFn (respone, browser, reject) {
    let html = await respone.text()
        
    if (html.indexOf(loginFail) !== -1) {
        browser.close();
        reject(`
        ${chalk.bgRed(`很抱歉, 您的用户名和密码不正确，请确认写入的账户配置是否正确`)}
        ${chalk.yellowBright('你可以执行命令：')}${chalk.cyanBright('mdmGit init')}
        重置成新的配置
        `)
    }  
   
    return respone
}

export default {
    [dashboard]: dashboardFn,
}