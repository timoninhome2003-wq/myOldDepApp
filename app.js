function hide(elem) {
    elem.style.opacity = "0"
    elem.style.pointerEvents = "none"
}
function show(elem) {
    elem.style.opacity = "1"
    elem.style.pointerEvents = "auto"
}
function conClas(clas, logCon) {
    let classs = document.querySelector("."+clas)

    if (clas == "Welcome") {
        presentClass = "Welcome"
        nextClasses = "ScreenLogIn"
        elems = []


        screenName.innerText = "Добро пожаловать!"

        let reclamaAkk = document.createElement("h3");
        reclamaAkk.innerText = "Для лучшего использования рекомендуется создать аккаунт"
        reclamaAkk.setAttribute("id", "reclamaAkk")
        reclamaAkk.classList.add("welcome")
        elems.push(reclamaAkk)
        
        let logInBut = document.createElement("button");
        logInBut.innerText = "Войти в аккаунт"
        logInBut.setAttribute("id", "logIn")
        logInBut.classList.add("welcome")
        elems.push(logInBut)

        let logUpBut = document.createElement("button");
        logUpBut.innerText = "Создать аккаунт"
        logUpBut.setAttribute("id", "logUp")
        logUpBut.classList.add("welcome")
        elems.push(logUpBut)



        classs.append(reclamaAkk)
        classs.append(logInBut)
        classs.append(logUpBut)

        logInBut.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses, "logIn")
        })
        logUpBut.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses, "logUp")
        })







    } else if (clas == "ScreenLogIn") {
        presentClass = "ScreenLogIn"
        nextClasses = ["Conditions", "Base"]
        elems = []


        if (logCon == "logIn") {
            screenName.innerText = "Вход в аккаунт"
        } else if (logCon == "logUp") {
            screenName.innerText = "Регистрация"
        }
        screenName.style.transform = 'translateX(-21%)'

        let usNameText = document.createElement("h3")
        usNameText.innerText = "Введите имя: "
        usNameText.setAttribute("id", "textInputName")
        usNameText.classList.add("screenLogIn")
        elems.push(usNameText)

        let usNameValue = document.createElement("input")
        usNameValue.setAttribute("type", "text")
        usNameValue.setAttribute("id", "inputName")
        usNameValue.classList.add("screenLogIn")
        elems.push(usNameValue)

        let usPassText = document.createElement("h3")
        usPassText.innerText = "Введите пароль: "
        usPassText.setAttribute("id", "textInputPassword")
        usPassText.classList.add("screenLogIn")
        elems.push(usPassText)

        let usPassValue = document.createElement("input")
        usPassValue.setAttribute("type", "text")
        usPassValue.setAttribute("id", "inputPassword")
        usPassValue.classList.add("screenLogIn")
        elems.push(usPassValue)

        let mem = document.createElement("img")
        mem.setAttribute("src", "Покой в богатстве.png")
        mem.setAttribute("alt", "Покой в богатстве")
        mem.setAttribute("id", "bellLion")
        mem.classList.add("screenLogIn")
        elems.push(mem)

        let next = document.createElement("button")
        next.innerText = "Войти"
        next.setAttribute("id", "logInServis")
        next.classList.add("screenLogIn")
        elems.push(next)

        let conditionsIf = document.createElement("h5")
        conditionsIf.innerText = "Условия соглашения"
        conditionsIf.setAttribute("id", "conditions")
        conditionsIf.classList.add("screenLogIn")
        elems.push(conditionsIf)



        classs.append(usNameText)
        classs.append(usNameValue)
        classs.append(usPassText)
        classs.append(usPassValue)
        classs.append(mem)
        classs.append(next)
        classs.append(conditionsIf)
        next.addEventListener("click", () => {
            let allData = {};
            if (logCon == "logIn") {
                let xhr = new XMLHttpRequest()
                xhr.open('GET', 'http://web4.informatics.ru:82/api/bcae51fdbf03dfb998b26f47db462195'. false);

                let usName = String(usNameValue.value).trim()
                let usPass = String(usPassValue.value)

                if (!usName || !usPass) {
                    alert("Заполните все поля")
                    return;
                }
                try {
                    xhr.send()
                    if (xhr.status === 200 && xhr.responseText) {
                        allData = JSON.parse(xhr.responseText)||{};
                        console.log("Данные успешно прочитаны")
                    } else {
                        console.log("Произошла ошибка: " + xhr.status)
                    }
                } catch(e) {
                    console.log("Ошибка чтения")
                }
            } else if (logCon == "logUp") {
                let us = new XMLHttpRequest();
                us.open('GET', 'http://web4.informatics.ru:82/api/bcae51fdbf03dfb998b26f47db462195', false);
                
                let usName = String(usNameValue.value).trim()
                let usPass = String(usPassValue.value)
                let usWallet = 200
                if (!usName || !usPass) {
                    alert("Заполните все поля")
                    return;
                }
                try {
                    us.send();
                    if (us.status === 200 && us.responseText) {
                        allData = JSON.parse(us.responseText)||{};
                        /*console.log("Найдено пользователей:", Object.keys(allData).length);*/
                    }
                } catch (error) {
                    console.log("ошибка чтения");
                }
                if (usName in allData){
                    alert("Такой пользователь уже существует")
                    return;
                }
                
                allData[usName] = {
                    usPass: usPass,
                    usWallet: usWallet
                }
                let dataJSON = JSON.stringify(allData)

                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://web4.informatics.ru:82/api/bcae51fdbf03dfb998b26f47db462195', false);
                try {
                    xhr.send(dataJSON);
                    if (xhr.status === 201 || xhr.status === 200) {
                        console.log("Данные успешно отправленны")
                        console.log(dataJSON)
                    } else {
                        alert("Произошла ошибка: " + xhr.status)
                    }
                } catch (error) {
                    console.log("Произошла ошибка")
                }
            } else {
                console.log("Ne bratan, ne ono")
            }
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses[1])
        })
        conditionsIf.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses[0])
        })







    } else if (clas == "Conditions") {
        presentClass = "Conditions"
        nextClasses = "ScreenLogIn"
        elems = []


        let srcName = document.createElement("h3")
        srcName.innerText = "Условия соглашения:"
        srcName.setAttribute("id", "srcName")
        srcName.classList.add("conditions")
        elems.push(srcName)

        let go1 = document.createElement("h5")
        go1.innerText = "Этот сайт создан исключительно в развлекательных целях! Создатель полность осуждает все вещи свящанные с такими темами и уж тем более не будет выводить этот проект на реальные, открытые биржи как способ для заработка и т.д."
        go1.setAttribute("id", "go1")
        go1.classList.add("conditions", "go")
        elems.push(go1)

        let go2 = document.createElement("h5")
        go2.innerText = "Еще раз говорю что автор не пренуждает к каким либо действиям связанными с этой тематикой, что в школьном, что и в осозноном возрасте"
        go2.setAttribute("id", "go2")
        go2.classList.add("conditions", "go")
        elems.push(go2)

        let go3 = document.createElement("h5")
        go3.innerText = "Ну и в принципе все, по всем вопросам пишите сюда: "
        go3.setAttribute("id", "go3")
        go3.classList.add("conditions", "go")
        elems.push(go3)

        let go4 = document.createElement("h5")
        go4.innerText = "+177 9356 66 308"
        go4.setAttribute("id", "go4")
        go4.classList.add("conditions")
        elems.push(go4)

        let atGalka = document.createElement('div')
        atGalka.setAttribute("id", "atGalka")
        atGalka.classList.add("conditions")
        elems.push(atGalka)

        let atText = document.createElement("h5")
        atText.innerText = 'Я понимаю и соглашаюсь с условиями соглашения'
        atText.setAttribute("id", "atText")
        atText.classList.add("conditions")
        elems.push(atText)

        let next = document.createElement("button")
        next.innerText = "Продолжить"
        next.setAttribute("id", "atNext")
        next.classList.add("conditions")
        elems.push(next)

        let g = document.createElement("h6")
        g.innerText = '✔'
        g.setAttribute("id", "g")
        g.classList.add('conditions')
        hide(g)
        elems.push(g)



        classs.append(srcName)
        classs.append(go1)
        classs.append(go2)
        classs.append(go3)
        classs.append(go4)
        classs.append(atGalka)
        classs.append(g)
        classs.append(atText)
        classs.append(next)
        next.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses)
        })
        atGalka.addEventListener('click', () => {
            atGalka.classList.toggle('active')
            if (g.style.opacity == 0) {
                show(g)
            } else {
                hide(g)
            }
        })







    } else if (clas == "Base") {
        presentClass = "Base"
        nextClasses = ["Welcome", "Click"]
        elems = []


        screenName.innerText = "Главный экран"

        let exit = document.createElement("h3")
        exit.innerText = "Выйти"
        exit.setAttribute("id", "exit")
        exit.classList.add("base")
        elems.push(exit)

        let balanceText = document.createElement("h4")
        balanceText.innerText = "баланс: "
        balanceText.setAttribute("id", "balanceText")
        balanceText.classList.add("base")
        elems.push(balanceText)

        let balanceValue = document.createElement("h4")
        balanceValue.innerText = "200р" // %balance% + "р"
        balanceValue.setAttribute("id", "balanceValue")
        balanceValue.classList.add("base")
        elems.push(balanceValue)

        let replenishBtn = document.createElement("button")
        replenishBtn.innerText = "Пополнить"
        replenishBtn.setAttribute("id", "toReplenish")
        replenishBtn.classList.add("base")
        elems.push(replenishBtn)


        let DEPafto = document.createElement("div")
        DEPafto.innerHTML = `
            <div id="depUp"></div>
            <h6 id="q1">🍒</h6>
            <h6 id="q2">💎</h6>
            <h6 id="q3">🍊</h6>
            <div id="depCenter"></div>
            <div id="depLever">
                <div id='upl'><div>
            </div>
            <div id="depDown"></div>
        `
        DEPafto.setAttribute("id", "DEPafto")
        DEPafto.classList.add("base")
        elems.push(DEPafto)

        let DEPup = document.querySelector("#depUp")
        let depCenter = document.querySelector("#depCenter")
        let q1 = document.querySelector("#q1")
        let q2 = document.querySelector("#q2")
        let q3 = document.querySelector("#q3")
        let DEPlever = document.querySelector("#depLever")
        let DEPdown = document.querySelector("#depDown")

        let depText = document.createElement("h5")
        depText.innerText = "Введите сумму для дэпа:"
        depText.setAttribute("id", "depInputText")
        depText.classList.add("base")
        elems.push(depText)

        let depValueInput = document.createElement("input")
        depValueInput.setAttribute("type", "text")
        depValueInput.setAttribute("id", "depInputValue")
        depValueInput.classList.add("base")
        elems.push(depValueInput)

        let depValueText = document.createElement("h3");
        depValueText.innerText = 'ставка:'
        depValueText.setAttribute("id", "depValueText")
        depValueText.classList.add("base")
        elems.push(depValueText)

        let depValue = document.createElement("h3");
        depValue.innerText = '50р'
        depValue.setAttribute("id", "depValue")
        depValue.classList.add('base')
        elems.push(depValue)

        let depBtn = document.createElement("button")
        depBtn.innerText = "ДЭПАТЬ !"
        depBtn.setAttribute("id", "depBtn")
        depBtn.classList.add("base")
        elems.push(depBtn)



        classs.append(exit)
        classs.append(balanceText)
        classs.append(balanceValue)
        classs.append(replenishBtn)
        classs.append(DEPafto)
        classs.append(depText)
        classs.append(depValueInput)
        classs.append(depValueText)
        classs.append(depValue)
        classs.append(depBtn)
        exit.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses[0])
        })
        replenishBtn.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses[1])
        })






        
    } else if (clas == "Click") {
        presentClass = "Click"
        nextClasses = "Base"
        elems = []

        screenName.innerText = "КЛИКАЙ!"
        screenName.style.transform = 'translateX(-15%)';

        let balanceText = document.createElement("h4")
        balanceText.innerText = "баланс: "
        balanceText.setAttribute("id", "balanceTextCl")
        balanceText.classList.add("click")
        elems.push(balanceText)

        let balanceValue = document.createElement("h4")
        balanceValue.innerText = "200р" // %balance% + "р"
        balanceValue.setAttribute("id", "balanceValueCl")
        balanceValue.classList.add("click")
        elems.push(balanceValue)

        let money = document.createElement("div")
        money.innerHTML = `
            <div id="vne"></>
            <div id="vnu"></>
            <h1 id="sym">$</h1>
        ` // Возможно понадобиться для тройного деления(внешка, внутрь, сим) 
        money.setAttribute("id", "money")
        money.classList.add("click")
        elems.push(money)

        let vne = document.querySelector("#vne")
        let vnu = document.querySelector("#vnu")
        let sym = document.querySelector("#sym")

        let back = document.createElement("button")
        back.innerText = "Вернуться"
        back.setAttribute("id", "backToBase")
        back.classList.add("click")
        elems.push(back)



        classs.append(balanceText)
        classs.append(balanceValue)
        classs.append(money)
        classs.append(back)
        back.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses)
        })
    }
}


let presentClass = "Welcome"
let nextClasses = "ScreenLogIn"
let screenName = document.querySelector("#screenName")
let elems = []

// Welcome, ScreenLogIn, Conditions, Base, Click

document.addEventListener('DOMContentLoaded', () => {
    conClas(presentClass)
})
