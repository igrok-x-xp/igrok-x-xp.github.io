let tg = window.Telegram.WebApp;
let dat_unsafe = tg.initDataUnsafe


displayObjectTree(dat_unsafe)

console.log("tg.initDataUnsafe", tg.initDataUnsafe)
console.log("tg", tg);

let fBtn = document.getElementsByClassName("f-btn")[0]
let sBtn = document.getElementsByClassName("s-btn")[0]
let api_btn = document.getElementsByClassName("api-btn")[0]

fBtn.addEventListener("click", () => {
    document.getElementsByClassName("Main")[0].style.display = "none";
    document.getElementsByClassName("test-form")[0].style.display = "block";
});



sBtn.addEventListener("click", () => {
    let title = document.getElementsByClassName("title-inp")[0];
    let description = document.getElementsByClassName("desc-inp")[0];
    let text = document.getElementsByClassName("text-inp")[0];


    let data = {
        title: title.value,
        desc: description.value,
        text: text.value
    }

    tg.sendData(JSON.stringify(data));
});

async function get_api_result() {
    const api_link = 'https://www.random.org/strings/?num=1&len=12&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new';
    try {
        const response = await fetch(api_link);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const randomString = await response.text();
//        console.log('Случайная строка:', randomString.trim());
        return randomString.trim();
    } catch (error) {
        console.error('Ошибка запроса:', error);
        return null;
    }
}

// Обработчик клика для api_btn
api_btn.addEventListener("click", async () => {
    let str;
    let gain = 0;
    output = document.getElementsByClassName('api_output')[0]
    str_output = document.getElementsByClassName('api_output2')[0]
    for (let index = 0; index < 100; index++) {
        str = await get_api_result();
        console.log(str)
        if (str) {
            gain += 1;
            output.textContent = `Получено запросов: ${gain}`;
            str_output.textContent = `Строка: ${str}`;
        }
    }
    output.textContent = `Получено запросов: ${gain}/100`;
});





// Ниже - навайбкожено
function displayObjectTree(obj, indent = 0, parentElement = null) {
    // Создаем корневой элемент, если он не передан
    const isRoot = parentElement === null;
    const container = isRoot ? document.createElement('div') : parentElement;

    // Добавляем стили для корневого элемента
    if (isRoot) {
        container.style.fontFamily = 'monospace';
        container.style.whiteSpace = 'pre';
        container.style.padding = '10px';
        container.style.backgroundColor = '#f5f5f5';
        container.style.borderRadius = '5px';
    }

    // Проходим по всем свойствам объекта
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const item = document.createElement('div');
            item.style.marginLeft = `${indent * 20}px`;

            if (typeof value === 'object' && value !== null) {
                // Если значение - объект (но не null), создаем раскрывающийся элемент
                const expander = document.createElement('span');
                expander.textContent = '▼ ';
                expander.style.cursor = 'pointer';
                expander.style.color = '#666';

                const keySpan = document.createElement('span');
                keySpan.textContent = `${key}: `;
                keySpan.style.color = '#881391';

                const typeSpan = document.createElement('span');
                typeSpan.textContent = Array.isArray(value) ? 'Array' : 'Object';
                typeSpan.style.color = '#1C00CF';

                const childrenContainer = document.createElement('div');
                childrenContainer.style.display = 'block'; // По умолчанию развёрнуто

                item.appendChild(expander);
                item.appendChild(keySpan);
                item.appendChild(typeSpan);
                item.appendChild(childrenContainer);

                // Обработчик клика для раскрытия/скрытия
                expander.addEventListener('click', () => {
                    if (childrenContainer.style.display === 'none') {
                        childrenContainer.style.display = 'block';
                        expander.textContent = '▼ ';
                    } else {
                        childrenContainer.style.display = 'none';
                        expander.textContent = '▶ ';
                    }
                });

                // Рекурсивно отображаем дочерние элементы
                displayObjectTree(value, indent + 1, childrenContainer);
            } else {
                // Простые значения
                const keySpan = document.createElement('span');
                keySpan.textContent = `${key}: `;
                keySpan.style.color = '#881391';

                const valueSpan = document.createElement('span');
                valueSpan.textContent = typeof value === 'string' ? `"${value}"` : value;
                valueSpan.style.color = value === null ? '#666' :
                                      typeof value === 'string' ? '#C41A16' :
                                      typeof value === 'number' ? '#1C00CF' :
                                      typeof value === 'boolean' ? '#0D22AA' : '#666';

                item.appendChild(keySpan);
                item.appendChild(valueSpan);
            }

            container.appendChild(item);
        }
    }

    // Если это корневой вызов, добавляем элемент в body
    if (isRoot) {
        document.body.appendChild(container);
        return container;
    }
}

// Пример использования:
const exampleObj = {
    name: "John Doe",
    age: 30,
    isActive: true,
    address: {
        street: "123 Main St",
        city: "New York",
        coordinates: {
            lat: 40.7128,
            lng: -74.0060
        }
    },
    hobbies: ["reading", "swimming", "coding"],
    education: [
        {
            degree: "Bachelor",
            year: 2015
        },
        {
            degree: "Master",
            year: 2017
        }
    ],
    nullValue: null
};

//displayObjectTree(exampleObj);