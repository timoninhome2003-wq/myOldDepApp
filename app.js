function getProxiedUrl(url) {
    const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/',
        'https://crossorigin.me/'
    ];
    
    const proxyIndex = 0; 
    return proxies[proxyIndex] + encodeURIComponent(url);
}

const server = getProxiedUrl('http://web4.informatics.ru:82/api/bcae51fdbf03dfb998b26f47db462195');let syms = 0;
function hide(elem) {
    elem.style.opacity = "0"
    elem.style.pointerEvents = "none"
}
function show(elem) {
    elem.style.opacity = "1"
    //elem.style.pointerEvents = "auto"
}
function getRandomSyms() {
    syms = ["🍒", "🍋", "💎", "❌"]
    let pr = Math.random()
    if (pr <= 0.3) {
        return syms[3]
    } else if (pr <= 0.6) {
        return syms[1]
    } else if (pr <= 0.85) {
        return syms[0]
    } else if (pr <= 1) {
        return syms[2]
    } else {
        return getRandomSyms()
    }
}
function conClas(clas, logCon, un) {
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
            conClas(nextClasses, "logUp", 'h')
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
        next.innerText = "~~"
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
        if (logCon == "logIn" || screenName.innerText == 'Вход в аккаунт') {
            next.innerText = "Войти"
        } else if (logCon == "logUp" || screenName.innerText == 'Регистрация') {
            next.innerText = "Готово"
        }
        classs.append(conditionsIf)
        next.addEventListener("click", () => {
            let allData = {};
            if (logCon == "logIn" || screenName.innerText == 'Вход в аккаунт') {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', server, false);

                let usName = String(usNameValue.value).trim();
                let usPass = String(usPassValue.value);
                let usWallet = 0;

                if (!usName || !usPass) {
                    alert("Заполните все поля");
                    return;
                }
    
                let allData = {};
    
                try {
                    xhr.send();
                    if (xhr.status === 200 && xhr.responseText) {
                        allData = JSON.parse(xhr.responseText) || {};
                        if (usName in allData) {
                            let userData = allData[usName];
                
                            if (userData.password === usPass) {
                                console.log("Добро пожаловать, " + usName);
                                usWallet = userData.wallet
                                for (let elem of elems) {
                                    elem.remove(classs)
                                }
                                conClas(nextClasses[1], 'h', usName)
                            } else {
                                alert("Неверный пароль!");
                            }
                        } else {
                            alert("Пользователь не найден!");
                        }
            
                    } else {
                        console.log("Произошла ошибка: " + xhr.status);
                    }
                } catch(e) {
                    console.log("Ошибка чтения");
                    alert("Ошибка соединения с сервером");
                }
            } else if (logCon == "logUp" || screenName.innerText == 'Регистрация') {
                let us = new XMLHttpRequest();
                us.open('GET', server, false);
                
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
                    password: usPass,
                    wallet: usWallet
                }
                let dataJSON = JSON.stringify(allData)

                let xhr = new XMLHttpRequest();
                xhr.open('POST', server, false);
                try {
                    xhr.send(dataJSON);
                    if (xhr.status === 201 || xhr.status === 200) {
                        console.log("Данные успешно отправленны")
                        console.log(dataJSON)
                        for (let elem of elems) {
                            elem.remove(classs)
                        }
                        conClas(nextClasses[1], 'h', usName)
                    } else {
                        alert("Произошла ошибка: " + xhr.status)
                    }
                } catch (error) {
                    console.log("Произошла ошибка")
                }
            } else {
                console.log("Ne bratan, ne ono")
            }
        })
        conditionsIf.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses[0], 'h', 'h')
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
        go1.innerText = "Этот сайт создан исключительно в развлекательных целях! Создатель полность осуждает все вещи связанные с такими темами и уж тем более не будет выводить этот проект на реальные, открытые биржи как способ для заработка и т.д."
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
        atGalka.innerHTML = `
            <h6 id='g' class='conditions'>✔</h6>
        `
        atGalka.setAttribute("id", "atGalka")
        atGalka.classList.add("conditions")
        elems.push(atGalka)

        let g = atGalka.querySelector("#g")
        hide(g)

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
            hide(g)
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses, 'h', 'h')
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
        balanceValue.innerText = "~~р"
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

        let DEPup = DEPafto.querySelector("#depUp")
        let depCenter = DEPafto.querySelector("#depCenter")
        let q1 = DEPafto.querySelector("#q1")
        let q2 = DEPafto.querySelector("#q2") 
        let q3 = DEPafto.querySelector("#q3")
        let DEPlever = DEPafto.querySelector("#depLever")
        let DEPdown = DEPafto.querySelector("#depDown")

        let depText = document.createElement("h5")
        depText.innerText = "Введите сумму для прокрутки:"
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
        depValue.innerText = '0р'
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
        depValueInput.addEventListener("input", () => {
            depValue.innerText = depValueInput.value + "р"
        })
        exit.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses[0], 'h', 'h')
        })
        replenishBtn.addEventListener("click", () => {
            for (let elem of elems) {
                elem.remove(classs)
            }
            conClas(nextClasses[1], 'h', usName)
        })
        let usName = un
        fetch(server)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Ошибка! Код: " + response.status);
            }
        })
        .then(function(data) {
            balanceValue.innerText = data[usName].wallet + 'р'
            let usBalance = data[usName].wallet
            depBtn.addEventListener("click", () => {
                if (!(depValueInput.value)) {
                    alert("Введите сумму для прокрутки")
                    return
                }
                if (depValueInput.value <= 0) {
                    alert("Не жульничаем!")
                    return
                }
                if (usBalance < depValueInput.value) {
                    alert("Вашего баланса не хватает для ставки. Можете уменьшить ставку или <Пополнить> баланс")
                    return
                }
                if (DEPlever) {
                    DEPlever.style.transform = 'rotate(130deg)'; // Добавьте 'deg'
                    DEPlever.style.transition = 'transform 0.3s ease';
                } else {
                    DEPlever = document.querySelector("#depLever")
                    DEPlever.style.transform = 'rotate(130deg)'; // Добавьте 'deg'
                    DEPlever.style.transition = 'transform 0.3s ease';
                }
                if (DEPdown) {
                    DEPdown.style.transform = 'translateY(20px)';
                    DEPdown.style.transition = 'transform 0.3s ease';
                } else {
                    DEPdown = document.querySelector("#depDown")
                    DEPdown.style.transform = 'translateY(20px)';
                    DEPdown.style.transition = 'transform 0.3s ease';
                }
                usBalance -= depValueInput.value
                q1.innerText = getRandomSyms()
                q2.innerText = getRandomSyms()
                q3.innerText = getRandomSyms()
                let pr = Number(depValueInput.value)
                let kp = 0
                if (q1.innerText == q2.innerText && q2.innerText == q3.innerText) {
                    if (q1.innerText == '❌') {
                        //alert("Пиздец ты лох ебанный, иди убейся, боооже")
                    } else if (q1.innerText == '🍊') {
                        kp = 5 // в 2 раза меньше
                    } else if (q1.innerText == '🍋') {
                        kp = 10 // тоже самое
                    } else if (q1.innerText == '🍒') {
                        kp = 50 // в 5 раз больше
                    } else if (q1.innerText == '💎') {
                        kp = 1000 // в 100 раз больше
                    } else {
                        alert("Вы сделали невозможное! Мега ошибка нах")
                    }
                    usBalance += kp * (pr / 10)
                    balanceValue.innerText = usBalance
                    
                    data[usName].wallet = usBalance
                    let dataJSON = JSON.stringify(data);

                    fetch(server, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: dataJSON
                    })
                    .then(function(response) {
                        if (response.status === 201) {
                            console.log("Данные успешно отправлены!");
                            return response.json();
                        } else {
                            console.log("Ошибка! Код: " + response.status);
                        }
                    })
                    .catch(function(error) {
                        console.log("Ошибка соединения!");
                    });
                } else {
                    data[usName].wallet = usBalance
                    balanceValue.innerText = usBalance

                    let dataJSON = JSON.stringify(data) 
                    fetch(server, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: dataJSON
                    })
                    .then(function(response) {
                        if (response.status === 201) {
                            console.log("Данные успешно отправлены!");
                            return response.json();
                        } else {
                            console.log("Ошибка! Код: " + response.status);
                        }
                    })
                    .catch(function(error) {
                        console.log("Ошибка соединения!");
                    });
                }
                setTimeout(() => {
                    if (DEPlever) {
                        DEPlever.style.transform = 'rotate(25deg)';
                    }
                    if (DEPdown) {
                        DEPdown.style.transform = 'translateY(0px)';
                    }
                }, 500);
            })
        })
        .catch(function(error) {
            console.log("Ошибка соединения!");
        });






        
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
        balanceValue.innerText = "~~р"
        balanceValue.setAttribute("id", "balanceValueCl")
        balanceValue.classList.add("click")
        elems.push(balanceValue)

        let money = document.createElement("div")
        money.innerHTML = `
            <div id="vne"></>
            <div id="vnu"></>
            <h1 id="sym">$</h1>
        ` 
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
        let usName = un
        fetch(server)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Ошибка! Код: " + response.status);
            }
        })
        .then(function(data) {
            balanceValue.innerText = String(data[usName].wallet) + 'р'
            let usBalance = data[usName].wallet
            money.addEventListener("click", () => {
                usBalance += 1
                balanceValue.innerText = usBalance + 'р'
            })
            back.addEventListener("click", () => {
                data[usName].wallet = usBalance
                let dataJSON = JSON.stringify(data);

                fetch(server, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: dataJSON
                })
                .then(function(response) {
                    if (response.status === 201) {
                        console.log("Данные успешно отправлены!");
                        return response.json();
                    } else {
                        console.log("Ошибка! Код: " + response.status);
                    }
                })
                .catch(function(error) {
                    console.log("Ошибка соединения!");
                });
                for (let elem of elems) {
                    elem.remove(classs)
                }
                conClas(nextClasses, 'h', usName)
            })
        })
        .catch(function(error) {
            console.log("Ошибка соединения!");
        });
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
