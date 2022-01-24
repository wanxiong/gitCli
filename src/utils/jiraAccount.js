import puppeteer from 'puppeteer'

import watchRespone from './watchRespose'

const questionUrl = 'http://jira.taimei.com/rest/issueNav/1/issueTable'

export const initAccount = async function (account) {
    return new Promise(async (resolve, reject) => {
        // 启动浏览器
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1280,
                height: 800,
            }

        })
        try {
            let questionData = {}
            // 新建界面
            const page = await browser.newPage()
            await page.setRequestInterception(true);
            page.on('request', async req => {
                req.continue({})
            })
            page.on('response', async res => {
                for (let key in watchRespone) {
                    if (res.url().indexOf(key) !== -1) {
                        return await watchRespone[key](res, page, account, browser, resolve, reject)
                    }
                }
                if (res.url().indexOf(questionUrl) !== -1) {
                    questionData = await res.json()
                    await browser.close();
                    resolve(questionData)
                }
                return res
            });

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
            // 获取数据
        } catch (error) {
            await browser.close();
            reject(error)
        }
        
    })
}