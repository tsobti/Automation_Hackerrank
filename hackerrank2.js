//AUTOMATING THE LOGIN, COPYING SOLUTION, AND SUBMITTING THE CODE IN EDITORIAL.


let pup = require("puppeteer");

let gPage;
let gBrowser;

let email="powoned882@vvaa1.com";
let pass="abcd123";
let codeObj;

pup
    .launch({
        headless: false,
        defaultViewport: null,      //fullscreen
        args: ["--start-maximized"],    //fullscreen bcoz of this
        slowMo:50,                  //slowmo bcoz script is very fast
    })
    .then(function (browser) {
        gBrowser = browser;
        return browser.pages();     //gives the array of pages, pehle vale me 2nd page pe kaam ho rha tha, 
    })
    .then(function (pageArr) {
        gPage = pageArr[0];         //here, to make it do the work in 1st page only, written arr[0th element]
        return gPage.goto("https://www.hackerrank.com/auth/login");
    })
    .then(function(){
        return gPage.type("#input-1",email);    //1st type input
    })
    .then(function(){
        return gPage.type("#input-2",pass);     //then type password
    })
    .then(function(){
        return Promise.all([
            gPage.waitForNavigation(),          //wait for navigation
            gPage.click("[data-analytics='LoginPassword']"),    //then click btn

        ]);
    })

    //############################STEPS FOLLOWED FOR CLICKING EACH BTNS: WAIT,CLICK AND ISN SOME WAIT FOR SELECTOR TOO
    
    //******OPEN INTERVIEW PREP BTN */
    .then(function(){
        return Promise.all([
            gPage.waitForNavigation(),
            gPage.click("[data-attr1='interview-preparation-kit']"),    //open interwiew prep kit

        ]);
    })


    //****OPEN WARMUP ******/
    //wait
    .then(function(){
        return gPage.waitForSelector("[data-attr1='warmup']");
    })

    .then(function(){
        return Promise.all([
            gPage.waitForNavigation(),
            gPage.click("[data-attr1='warmup']"),        //open warmup

        ]);
    })


    //****OPEN PROBLEM ******/
    //wait
    .then(function(){
        return gPage.waitForSelector(".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled");
    })


    .then(function(){
        return Promise.all([
            gPage.waitForNavigation(),
            gPage.click(".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled"),        //open PROBLEM

        ]);
    })



    //****OPEN EDITORIAL ******/
    //wait
    .then(function(){
        return gPage.waitForSelector("#tab-1-item-4");
    })

    .then(function(){
        return Promise.all([
            gPage.waitForNavigation(),
            gPage.click("#tab-1-item-4"),        //open EDITORIAL

        ]);
    })

    //****OPEN LOCK BTN ******/
    
    // .then(function(){
    //     return gPage.click("ui-btn ui-btn-normal ui-btn-primary ui-btn-styled");
    // })
    //handling this via function bcoz ans is locked only for the first time, so next time visit krte ue error na show kre, islie promise laga ke resolve even if err.
    .then(function(){
        return handleLockBtn(".ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled");
    })

    //*****SELECT FIRST LANGUAGE AND PRINT THE SOLUTION CODE ALSO */
    .then(function(){
        return gPage.evaluate(
            function(){
            let allCodes=document.querySelectorAll(".challenge-editorial-block.editorial-setter-code .highlight");
            let allLanguages=document.querySelectorAll(".challenge-editorial-block.editorial-setter-code h3");

            let obj={};
            obj.code=allCodes[0].innerText;
            obj.language=allLanguages[0].innerText;
            return obj;
        });
    })

    //GO TO PROBLEM tab
    .then(function(obj){
        codeObj=obj;
        return Promise.all([
            gPage.waitForNavigation(),
            gPage.click("[data-attr2='Problem']")
        ])
    })

    //dropdown ka selector
    .then(function(){
        return gPage.waitForSelector(".css-1hwfws3");
    })
    .then(function(){
        return gPage.click(".css-1hwfws3");    
    })
    .then(function(){
        return gPage.type(".css-1hwfws3",codeObj.language);
    })
    .then(function(){
        return gPage.keyboard.press("Enter");
    })

    //click checkbox and write in test case text box
    .then(function(){
        return gPage.click("[type='checkbox']");    
    })
    .then(function(){
        return gPage.waitForSelector("#input-1");
    })
    .then(function(){
        return gPage.type("#input-1",codeObj.code);
    })

    .then(function(){
        return gPage.keyboard.down("Control"); //isse pressed rhegi
    })
    .then(function(){
        return gPage.keyboard.press("KeyA");   //press krke released
    })
    .then(function(){
        return gPage.keyboard.press("KeyX");
    })
    .then(function(){
        return gPage.keyboard.up("Control");
    })

    //editor pe cick
    .then(function(){
        return gPage.click(".hr-monaco-editor-parent");
    })
    .then(function(){
        return gPage.keyboard.down("Control");
    })
    .then(function(){
        return gPage.keyboard.press("KeyA");
    })
    .then(function(){
        return gPage.keyboard.press("KeyV");
    })
    .then(function(){
        return gPage.keyboard.up("Control");
    })

    .then(function(){
        return gPage.click(".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled");
    })
    // .then(function(obj){
    //     console.log(obj);
    // })
    
    .catch(function (err) {
        console.log(err);
    })




    //HANDLING LOCK BUTTON
    function handleLockBtn(selector){
        return new Promise(function(resolve,reject){
            gPage
                .waitForSelector(selector)
                .then(function(){
                    return gPage.click(selector);
                })
                .then(function(){
                    //lock btn click kr chuke honge
                    resolve();
                })
                .catch(function(err){
                    //error ye tha ki btn nhi mila, so humne use resolve kr dia 
                    //bcoz fark nhi padta btn mile ya na mile hume error nhi chahie
                    resolve();
                });
        });
    }
