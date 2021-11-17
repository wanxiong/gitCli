const puppeteer = require('puppeteer');

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
        await boardBtn.click();
        // 获取下拉数据
        const boardList = []
        const linkList = await page.$$('#greenhopper_menu_dropdown_recent .aui-list-truncate li');
        for (var i = 0; i< linkList.length; i++) {
            let data = await linkList[i].$eval('a', el => {
                const href = el.getAttribute('href');
                // 获取所有的信息
                let reg = new RegExp("rapidView=([^&?]*)", "ig");
                let str = href.match(reg) ? href.match(reg) : ''
                const params = '?' + str
                return {
                    originHref: 'http://jira.taimei.com' + href,
                    innerHTML: el.innerHTML,
                    id: el.getAttribute('id'),
                    href: 'http://jira.taimei.com' + href.split('?')[0] + params
                }
            })
            boardList.push(data)
        }
    //     await page.screenshot({
    //        path: __dirname + '/baidu.png'
    //     })
        // 获取数据
        const respone  = await page.goto(getListUrl + '?rapidViewId=244');
        const jsonData = await respone.json()
        await browser.close();
        resolve(jsonData, boardList)
    })
}