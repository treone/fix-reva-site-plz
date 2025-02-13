function showInputWindow() {
    const modalHtml = `
        <div id="input-window"
             style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a0b0a;z-index:9999;">
            <i class="icon icon--xsm icon--close" style="position:absolute;top:10px;right:10px;" id="input-window-close"></i>
            <div class="ovl-title">Введите пин-коды</div>
            <div class="ovl-content content-text">
                <p>Разделенные пробелами, переносами строк или запятыми:</p>
                <div class="js-chest-items">
                    <textarea id="input-window-textarea" style="width:500px;height:400px;margin-bottom:10px;"></textarea>
                </div>
                <div class="text-center">
                    <div class="btn btn--xsm btn--lite" id="input-window-submit">
                        <span class="btn__text">Проверить</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('input-window-textarea').focus();

    document.getElementById('input-window-submit').onclick = () => {
        const textarea = document.getElementById('input-window-textarea');
        // Разбиваем текст на пин-коды по пробелам, запятым и переносам строк, убираем пустые значения
        const pinCodes = textarea.value.split(/[\s,]+/).filter(pin => pin.trim() !== '');
        if (pinCodes.length) {
            document.getElementById('input-window').remove();
            processPinCodes(pinCodes);
        } else {
            alert('Введите хотя бы один пин-код.');
        }
    };

    // Закрытие окна при клике на кнопку "X"
    document.getElementById('input-window-close').onclick = () => {
        document.getElementById('input-window').remove();
    };
}


function processPinCodes(pinCodes) {
    // Рекурсивная обработка пин-кодов
    (function processNext(index) {
        if (index >= pinCodes.length) {
            console.log('Все пин-коды обработаны.');
            addButton();
            return;
        }
        const pinCode = pinCodes[index];
        console.log(`Обработка пин-кода (${index + 1}/${pinCodes.length}): ${pinCode}`);

        const pinInput = document.querySelector('input[name="pin"]');
        if (pinInput) {
            pinInput.value = pinCode;
        } else {
            console.error('Поле для ввода пин-кода не найдено.');
            return;
        }

        const submitButton = document.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.click();
        } else {
            console.error('Кнопка отправки не найдена.');
            return;
        }

        // Ждем появления кнопки "Активировать" и кликаем по ней
        function activatePopup() {
            const activateSubmit = document.querySelector('.ovl input[type="submit"]');
            if (activateSubmit) {
                activateSubmit.click();
                setTimeout(() => clickOkButton(index + 1), 1000);
            } else {
                setTimeout(activatePopup, 1000);
            }
        }

        // Ждем появления кнопки "ОК" и кликаем по ней
        function clickOkButton(nextIndex) {
            const okButton = document.querySelector('.js-ovl-close');
            if (okButton) {
                okButton.click();
                setTimeout(() => processNext(nextIndex), 1000);
            } else {
                setTimeout(() => clickOkButton(nextIndex), 1000);
            }
        }

        setTimeout(activatePopup, 1000);
    })(0);
}

function addButton() {
    const targetElement = document.querySelector('#pin-form > div.text-center');
    if (targetElement && !document.querySelector('#violet-add-pins')) {
        targetElement.insertAdjacentHTML('beforeend', `
            <div class="btn" style="background: #7428ac;" id="violet-add-pins">
                <div class="btn__text">Проверить несколько</div>
            </div>
        `);
        document.querySelector('#violet-add-pins').addEventListener('click', () => {
            showInputWindow();
        });
    }
}

const observer = new MutationObserver((mutations, obs) => {
    const targetElement = document.querySelector('#pin-form > div.text-center');
    if (targetElement) {
        // Добавляем кнопку для ввода нескольких пин-кодов
        addButton();
        obs.disconnect();
    }
});

observer.observe(document, {childList: true, subtree: true});
