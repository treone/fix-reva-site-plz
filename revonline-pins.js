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
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('input-window-textarea').focus();

    document.getElementById('input-window-submit').onclick = () => {
        const textarea = document.getElementById('input-window-textarea');
        const pinCodes = textarea.value.split(/[\s,]+/).filter(pin => pin.trim() !== '');
        if (pinCodes.length) {
            document.getElementById('input-window').remove();
            processPinCodes(pinCodes);
        } else {
            alert('Введите хотя бы один пин-код.');
        }
    };

    document.getElementById('input-window-close').onclick = () => {
        document.getElementById('input-window').remove();
    };
}

function createProgressBar(totalPins) {
    const progressBarHtml = `
        <div id="global-progress-bar" style="
            position: fixed;
            top: 20px;
            left: 20px;
            background: #160a0a;
            padding: 10px;
            border: 1px solid #d0c696;
            border-radius: 0;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 10000;
        ">
            <div id="progress-container" style="
                width: 400px; /* Увеличено в 2 раза */
                height: 40px; /* Увеличено в 2 раза */
                background: #262020;
                border: 1px solid #d0c696;
                border-radius: 0;
                position: relative;
                overflow: hidden;
            ">
                <div id="progress-fill" style="
                    width: 0%;
                    height: 100%;
                    background: #ac2c28;
                    transition: width 0.3s ease;
                "></div>
                <div id="progress-text" style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #d0c696;
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    font-weight: bold;
                    z-index: 1;
                ">0 / ${totalPins}</div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', progressBarHtml);
}

function updateProgress(processedPins, totalPins) {
    const progress = (processedPins / totalPins) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    if (progressFill && progressText) {
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${processedPins} / ${totalPins}`; // Обновляем текст
    }
}

function removeProgressBar() {
    const progressBar = document.getElementById('global-progress-bar');
    if (progressBar) {
        progressBar.remove();
    }
}

function processPinCodes(pinCodes) {
    const totalPins = pinCodes.length;
    let processedPins = 0;

    // Создаем прогресс-бар и передаем общее количество пин-кодов
    createProgressBar(totalPins);

    (function processNext(index) {
        if (index >= pinCodes.length) {
            console.log('Все пин-коды обработаны.');
            removeProgressBar(); // Удаляем прогресс-бар после завершения
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
            removeProgressBar(); // Удаляем прогресс-бар в случае ошибки
            return;
        }

        const submitButton = document.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.click();
        } else {
            console.error('Кнопка отправки не найдена.');
            removeProgressBar(); // Удаляем прогресс-бар в случае ошибки
            return;
        }

        function activatePopup() {
            const activateSubmit = document.querySelector('.ovl input[type="submit"]');
            if (activateSubmit) {
                activateSubmit.click();
                setTimeout(() => clickOkButton(index + 1), 1000);
            } else {
                setTimeout(activatePopup, 1000);
            }
        }

        function clickOkButton(nextIndex) {
            const okButton = document.querySelector('.js-ovl-close');
            if (okButton) {
                okButton.click();
                processedPins++;
                updateProgress(processedPins, totalPins); // Обновляем прогресс
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
        addButton();
        obs.disconnect();
    }
});

observer.observe(document, {childList: true, subtree: true});