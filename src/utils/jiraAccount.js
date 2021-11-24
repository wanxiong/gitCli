// const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer');
import puppeteer from 'puppeteer'
import path from 'path'

const getListUrl = 'http://jira.taimei.com/rest/greenhopper/1.0/xboard/work/allData.json'

export const initAccount = async function (account) {
    return new Promise(async (resolve, reject) => {
        // 启动浏览器
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: {
                width: 1280,
                height: 800,
            }
        })
        try {
            // 新建界面
            const page = await browser.newPage()
            // 跳转界面
            await page.goto('http://jira.taimei.com/login.jsp')
            const loginInput = await page.$('#login-form-username');
            
            const loginPassword = await page.$('#login-form-password');
            // 提交
            const loginSubmitBtn = await page.$('#login-form-submit'); 
            // 获取焦点  填充内容
            loginInput.focus()
            await page.keyboard.type(account.name)
            loginPassword.focus()
            await page.keyboard.type(account.password)
            //点击按钮
            await loginSubmitBtn.click()
            // 等待2秒 跳转需要时间
            await page.waitForTimeout(account.delay)
            // 得到看板按钮
            const boardBtn = await page.$('#greenhopper_menu');
            // 点击按钮
            await page.screenshot({
               path: process.cwd() + '/account.png'
            })
            await boardBtn.click();
            // 获取下拉数据
            const boardList = []
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
            await page.screenshot({
               path: path.resolve(__dirname, '../account.png')
            })
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
                const respone  = await page.goto(getListUrl + params);
                const jsonData = await respone.json()
                await browser.close();
                resolve(jsonData)
            } else {
                throw new Error('你没有相关的看板内容====' + account.designatedBoard.trim() + ',请重新选择看板')
            }
            // 获取数据
        } catch (error) {
            await browser.close();
            reject(error)
        }
        
    })
}