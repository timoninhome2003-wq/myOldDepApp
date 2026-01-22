let currentScreen = null;
let isTransitioning = false;

// Функция для ожидания
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Плавный переход между экранами
async function transitionToScreen(oldClass, newClass) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    try {
        // Находим элементы
        const oldElement = document.querySelector(`.${oldClass}`);
        const newElement = document.querySelector(`.${newClass}`);
        
        if (!newElement) {
            console.error(`Элемент .${newClass} не найден!`);
            return;
        }
        
        // Если есть старый элемент - скрываем его с анимацией
        if (oldElement) {
            oldElement.classList.remove('active');
            oldElement.style.opacity = '0';
            oldElement.style.transform = 'translateY(-20px)';
            oldElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            
            // Ждем анимации
            await wait(400);
            
            // Скрываем старый элемент
            oldElement.style.display = 'none';
        }
        
        // Показываем новый экран
        newElement.style.display = 'block';
        
        // Анимация появления нового экрана
        await wait(50);
        newElement.style.opacity = '1';
        newElement.style.transform = 'translateY(0)';
        newElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        newElement.classList.add('active');
        
        // Обновляем текущий экран
        currentScreen = newClass;
        
    } catch (error) {
        console.error('Ошибка при переходе:', error);
    } finally {
        isTransitioning = false;
    }
}

// Плавное скрытие элементов
async function fadeOutElements(elements) {
    if (!elements || elements.length === 0) return;
    
    for (let i = 0; i < elements.length; i++) {
        const elem = elements[i];
        if (elem && elem.style) {
            elem.style.transition = `opacity 0.3s ease ${i * 0.05}s, transform 0.3s ease ${i * 0.05}s`;
            elem.style.opacity = '0';
            elem.style.transform = 'translateY(10px)';
        }
    }
    
    await wait(400);
    
    // Удаляем элементы после анимации
    elements.forEach(elem => {
        if (elem && elem.parentNode) {
            elem.parentNode.removeChild(elem);
        }
    });
}

// ========== ОСТАЛЬНОЙ ВАШ КОД БЕЗ ИЗМЕНЕНИЙ ==========

let locationData = null;
const server = 'http://localhost:8080/';
let syms = 0;
async function getLocationGuaranteed() {
  LocationService.getLocation();
  
  return new Promise((resolve) => {
    const check = () => {
      const raw = sessionStorage.getItem('weatherLocationData');
      
      if (raw) {
        try {
          const data = JSON.parse(raw);
          if (data && data.address && data.address.city) {
            resolve(data);
            return;
          }
        } catch (e) {}
      }
      
      setTimeout(check, 100);
    };
    
    check();
  });
}
function hide(elem) {
    elem.style.opacity = "0"
    elem.style.pointerEvents = "none"
}
function show(elem) {
    elem.style.opacity = "1"
    elem.style.pointerEvents = "auto"
}
function getRandomSyms() {
    syms = ["🍒", "🧸", "🍭", "❌"]
    let pr = Math.random()
    if (pr <= 0.3) {
        return syms[3]
    } else if (pr <= 0.5) {
        return syms[1]
    } else if (pr <= 0.85) {
        return syms[0]
    } else if (pr <= 1) {
        return syms[2]
    } else {
        return getRandomSyms()
    }
}

async function conClas(clas, logCon, un) {
    let classs = document.querySelector("."+clas)

    if (clas == "Welcome") {
        presentClass = "Welcome"
        nextClasses = "ScreenLogIn"
        elems = []
        
        // НЕ создаем кнопки здесь, они уже есть в HTML
        // Просто добавляем их в массив elems для управления
        const reclamaAkk = document.getElementById("reclamaAkk");
        const logInBut = document.getElementById("logIn");
        const logUpBut = document.getElementById("logUp");
        
        elems.push(reclamaAkk);
        elems.push(logInBut);
        elems.push(logUpBut);





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

        let back = document.createElement("h3")
        back.innerText = '←'
        back.setAttribute("id", "back2")
        back.classList.add("screenLogIn")
        elems.push(back)

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



        classs.append(back)
        classs.append(usNameText)
        classs.append(usNameValue)
        classs.append(usPassText)
        classs.append(usPassValue)
        classs.append(mem)
        classs.append(next)
        back.disabled = true
        back.addEventListener("click", () => {
            location.reload();
        })
        mem.addEventListener("click", () => {
            mem.classList.add("ultra-cringe-shake")
            setTimeout(function(){mem.classList.remove("ultra-cringe-shake")}, 500)
        })
        if (logCon == "logIn" || screenName.innerText == 'Вход в аккаунт') {
            next.innerText = "Войти"
        } else if (logCon == "logUp" || screenName.innerText == 'Регистрация') {
            next.innerText = "Готово"
        }
        classs.append(conditionsIf)
        next.addEventListener("click", async () => {
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
                        allData = JSON.parse(xhr.responseText) || {}; //==========================================================
                        if (usName in allData) {
                            let userData = allData[usName];
                
                            if (userData.password === usPass) {
                                console.log("Добро пожаловать, " + usName);
                                usWallet = userData.wallet
                                await fadeOutElements(elems);
                                await transitionToScreen(presentClass, nextClasses[1]);
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
                        await fadeOutElements(elems);
                        await transitionToScreen(presentClass, nextClasses[1]);
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
        conditionsIf.addEventListener("click", async () => {
            await fadeOutElements(elems);
            await transitionToScreen(presentClass, nextClasses[0]);
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
        go1.innerText = `Блаб лабл аблабл аблаблаблабла б лаблаблаблаблаб целях! Создатель блаблабла блаблабл абл абла блаблабла б лаблаб лаблаб, и уж тем 
        более бл аблаб лаблабла блаб лаблаб ла блаблабла, блаблабл аблаб лаб лаблаб лаб лаблаблаб, и т.д.`
        go1.setAttribute("id", "go1")
        go1.classList.add("conditions", "go")
        elems.push(go1)

        let go2 = document.createElement("h5")
        go2.innerText = `Еще раз говорю, что блабл аб лаблаблабл а блабл абла блаблаблаб лаблаблабл а блаб лаблаблабл, 
        бла б лаблаблабл, абл а б лаблаблаб лаблаблаб`
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
        g.style.pointerEvents = "none"
        go4.addEventListener("click", () => {
            go4.classList.add("ultra-cringe-shake")
            setTimeout(function(){go4.classList.remove("ultra-cringe-shake")}, 1000)
        })
        next.addEventListener("click", async () => {
            hide(g)
            await fadeOutElements(elems);
            await transitionToScreen(presentClass, nextClasses);
            conClas(nextClasses, 'h', 'h')
        })
        atGalka.addEventListener('click', () => {
            atGalka.classList.toggle('active')
            if (g.style.opacity == 0) {
                g.style.opacity = 1
            } else {
                g.style.opacity = 0
            }
        })







    } else if (clas == "Base") {
        presentClass = "Base"
        nextClasses = ["Welcome", "Click", 'Data']
        elems = []


        screenName.innerText = "Главный экран"

        let settings = document.createElement("h3")
        settings.innerHTML = `
            <h3 id='set' class='base'>⚙️</h3>
            <h3 id='setText' class='base'>Настройки</h3>
            <h3 id='exit' class='base'>Выйти</h3>
            <h3 id='usData' class='base'>Данные</>
        `
        settings.setAttribute("id", "settings")
        settings.classList.add("base")
        elems.push(settings)

        let exit = settings.querySelector("#exit")
        let usData = settings.querySelector("#usData")
        let set = settings.querySelector("#set")
        let setText = settings.querySelector("#setText")

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
            <h6 id="q1">🧸</h6>
            <h6 id="q2">🍭</h6>
            <h6 id="q3">🍒</h6>
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



        classs.append(settings)
        classs.append(balanceText)
        classs.append(balanceValue)
        classs.append(replenishBtn)
        classs.append(DEPafto)
        classs.append(depText)
        classs.append(depValueInput)
        classs.append(depValueText)
        classs.append(depValue)
        classs.append(depBtn)
        hide(exit)
        hide(usData)
        set.style.pointerEvents = 'none'
        hide(setText)
        settings.addEventListener("mouseenter", () => {
            show(exit)
            show(usData)
            show(setText)
            settings.style.width = '300px'
            settings.style.height = '250px'
            settings.style.top = '30vh'
            settings.style.left = '85vw'
            set.style.left = '10%'
            set.style.top = '-5%'
            setText.style.top = '-13.5%'
            setText.style.left = '63px'
            usData.style.top = '20%'
            usData.style.left = '50%'
            exit.style.top = '55%'
            exit.style.left = '50%'
        })
        settings.addEventListener("mouseleave", () => {
            hide(exit)
            hide(usData)
            hide(setText)
            settings.style.width = '50px'
            settings.style.height = '50px'
            settings.style.top = '20vh'
            settings.style.left = '80vw'
            set.style.top = '-35%'
            set.style.left = '50%'
        })
        depValueInput.addEventListener("input", () => {
            depValue.innerText = depValueInput.value + "р"
        })
        exit.addEventListener("click", async () => {
            await fadeOutElements(elems);
            await transitionToScreen(presentClass, nextClasses[0]);
            location.reload();
        })
        replenishBtn.addEventListener("click", async () => {
            await fadeOutElements(elems);
            await transitionToScreen(presentClass, nextClasses[1]);
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
            usData.addEventListener("click", async () => {
                let x = prompt("Введите свой пароль")
                if (x != data[usName].password) {
                    alert("Неверный пароль")
                    return
                }
                await fadeOutElements(elems);
                await transitionToScreen(presentClass, nextClasses[2]);
                conClas(nextClasses[2], "h", usName)
            })

            balanceValue.innerText = data[usName].wallet + 'р'
            let usBalance = data[usName].wallet
            depBtn.addEventListener("click", () => {
                if (!(depValueInput.value)) {
                    alert("Введите сумму для прокрутки")
                    return
                }
                if (depValueInput.value <= 0 || String(depValueInput.value).includes('.') || String(depValueInput.value).includes(',') || isNaN(Number(depValueInput.value))) {
                    alert("Не жульничаем!")
                    return
                }
                if (usBalance < depValueInput.value) {
                    alert("Вашего баланса не хватает для ставки. Можете уменьшить ставку или <Пополнить> баланс")
                    return
                }
                depBtn.style.backgroundColor = 'rgb(174, 0, 0)'
                depBtn.style.pointerEvents = 'none'
                setTimeout(function() {
                    depBtn.style.pointerEvents = 'auto'
                    depBtn.style.backgroundColor = 'rgb(220, 0, 0)'
                }, 550)
                if (DEPlever) {
                    DEPlever.style.transform = 'rotate(130deg)';
                    DEPlever.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                } else {
                    DEPlever = document.querySelector("#depLever")
                    DEPlever.style.transform = 'rotate(130deg)';
                    DEPlever.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }
                if (DEPdown) {
                    DEPdown.style.transform = 'translateY(20px)';
                    DEPdown.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                } else {
                    DEPdown = document.querySelector("#depDown")
                    DEPdown.style.transform = 'translateY(20px)';
                    DEPdown.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
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
                    } else if (q1.innerText == '🧸') {
                        kp = 10 // тоже самое
                    } else if (q1.innerText == '🍒') {
                        kp = 50 // в 5 раз больше
                    } else if (q1.innerText == '🍭') {
                        kp = 1000 // в 100 раз больше
                    } else {
                        alert("Вы сделали невозможное! Мега ошибка нах")
                    }
                    usBalance += kp * (pr / 10)
                    balanceValue.innerText = usBalance
                    if (usBalance >= 100000) {
                        //alert("Ты справился! Ты достиг этой цели!")
                        //alert("Далее, если ты будешь продолжать играть и твой баланс не будет становится меньше, у тебя появится особая, приорететная функция")
                    }
                    
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

        let vne = money.querySelector("#vne")
        let vnu = money.querySelector("#vnu")
        let sym = money.querySelector("#sym")

        let back = document.createElement("button")
        back.innerText = "Вернуться"
        back.setAttribute("id", "backToBase")
        back.classList.add("click")
        elems.push(back)



        classs.append(balanceText)
        classs.append(balanceValue)
        classs.append(money)
        classs.append(back)
        sym.style.pointerEvents = 'none'
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
            let dataJSON = ''
            money.addEventListener("click", () => {
                vne.style.width = '45vmin'
                vne.style.height = '45vmin'
                vnu.style.width = '39vmin'
                vnu.style.height = '39vmin'
                usBalance += 1
                balanceValue.innerText = usBalance + 'р'

                data[usName].wallet = usBalance
                dataJSON = JSON.stringify(data);

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
                setTimeout(function(){
                    vne.style.width = '60vmin'
                    vne.style.height = '60vmin'
                    vnu.style.width = '54vmin'
                    vnu.style.height = '54vmin'
                }, 200)
            })
            back.addEventListener("click", async () => {
                await fadeOutElements(elems);
                await transitionToScreen(presentClass, nextClasses);
                conClas(nextClasses, 'h', usName)
            })
        })
        .catch(function(error) {
            console.log("Ошибка соединения!");
        });






    } else if (clas === 'Data'){
        presentClass = "Data"
        nextClasses = "Base"
        elems = []
        
        let usName = un

        screenName.innerText = 'Данные ' + usName

        let dataPass = document.createElement("h3")
        dataPass.innerText = 'Пароль: ~~'
        dataPass.setAttribute("id", "dataPass")
        dataPass.classList.add("data")
        elems.push(dataPass)

        let dataWallet = document.createElement("h3")
        dataWallet.innerText = 'Баланс: ~~р'
        dataWallet.setAttribute("id", "dataWallet")
        dataWallet.classList.add("data")
        elems.push(dataWallet)

        let dataPos = document.createElement("h3")
        dataPos.innerText = 'Местоположение: ~~ (Если вдруг данные не загружаются в течении 15 секунд, Выйдете на главный режим и зайдите снова)'
        dataPos.setAttribute("id", "dataPos")
        dataPos.classList.add("data")
        elems.push(dataPos)

        let back = document.createElement("button")
        back.innerText = 'Обратно'
        back.setAttribute("id", "back")
        back.classList.add("data")
        elems.push(back)


        classs.append(dataPass)
        classs.append(dataWallet)
        classs.append(dataPos)
        classs.append(back)
        back.addEventListener("click", async () => {
            await fadeOutElements(elems);
            await transitionToScreen(presentClass, nextClasses);
            conClas(nextClasses, "h", usName)
        })
        fetch(server)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Ошибка! Код: " + response.status);
            }
        })
        .then(function(data) {
            dataPass.innerText = 'Пароль: ' + data[usName].password
            dataWallet.innerText = 'Баланс: ' + data[usName].wallet + 'р'
        })
        

        

        getLocationGuaranteed().then(data => {
            locationData = data;
    
            if (locationData) {
                let res = 'Местоположение: '
                let city = locationData.address.city || "";
                let country = locationData.address.country || '';
                let suburb = locationData.address.suburb || '';
                let road = locationData.address.road || "";
                
                if (!country) {
                    res += ""
                } else {
                    res += String(country) + "; "
                }
                if (!city) {
                    res += ""
                } else {
                    res += String(city) + "; "
                }
                if (!suburb) {
                    res += ""
                } else {
                    res += String(suburb) + "; "
                }
                if (!road) {
                    res += ""
                } else {
                    res += String(road) + "; "
                }

            dataPos.innerText = res; 
            }
        });
    }
}


let presentClass = "Welcome"
let nextClasses = "ScreenLogIn"
let screenName = document.querySelector("#screenName")
let elems = []

// Welcome, ScreenLogIn, Conditions, Base, Click, Data

document.addEventListener('DOMContentLoaded', () => {
    // Плавное появление первого экрана
    setTimeout(() => {
        const welcomeScreen = document.querySelector('.Welcome');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'block';
            welcomeScreen.classList.add('active');
        }
        conClas(presentClass)
    }, 100);
})
