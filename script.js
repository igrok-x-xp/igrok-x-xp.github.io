let tg = window.Telegram.WebApp;
let dat_unsafe = tg.initDataUnsafe


displayObjectTree(dat_unsafe)

console.log("%cДанные:", "font-size: 20px; font-weight: bold;");
console.log("tg.initDataUnsafe", tg.initDataUnsafe)
console.log("tg", tg);
const urlParams = new URLSearchParams(window.location.search);
console.log('urlParams', urlParams)

let fBtn = document.getElementsByClassName("f-btn")[0]
let sBtn = document.getElementsByClassName("s-btn")[0]
let api_btn = document.getElementsByClassName("api-btn")[0]

fBtn.addEventListener("click", () => {
    document.getElementsByClassName("Main")[0].style.display = "none";
    document.getElementsByClassName("test-form")[0].style.display = "block";
});




// Обработчик клика для api_btn
api_btn.addEventListener("click", async () => {
    const output = document.querySelector('.api_output');
    const str_output = document.querySelector('.api_output2');
    const progressBar = document.getElementsByClassName('progress-bar')[0];

    const totalRequests = 50;
    const batchSize = 5; // Число параллельных запросов
    let successCount = 0;

    output.textContent = `Запущено 0/${totalRequests}...`;

    for (let i = 0; i < totalRequests; i += batchSize) {
        const batchPromises = [];

        // Создаем пачку промисов
        for (let j = 0; j < batchSize && i + j < totalRequests; j++) {
            batchPromises.push(get_api_result());
        }

        // Обрабатываем пачку
        const batchResults = await Promise.allSettled(batchPromises);

        // Обновляем UI для каждой успешной строки
        batchResults.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                successCount++;
                str_output.textContent = `Последняя строка: ${result.value}`;
                output.textContent = `Запущено ${i}/${totalRequests}... Успешно: ${successCount}/${totalRequests}`;
                progressBar.style.background = `linear-gradient(90deg, #4CAF50 ${successCount}%, #ddd ${successCount/totalRequests/10}%)`;
            }
        });

        // Искусственная задержка между пачками (опционально)
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    output.textContent = `Готово! Успешно: ${successCount}/${totalRequests}`;
});

async function get_api_result() {
//    return '1233123'
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