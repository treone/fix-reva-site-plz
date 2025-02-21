function getUnusedPinCodes() {
    const pins = [];
    document.querySelectorAll('.b-my-pin').forEach(pinElement => {
        const activateButton = pinElement.querySelector('[data-testid="pin-code-buttons__link"]');
        if (activateButton) {
            const pinCodeInput = pinElement.querySelector('.b-input_pin');
            if (pinCodeInput) {
                pins.push(pinCodeInput.value);
            }
        }
    });
    return pins;
}

function showPinCodesPopup(pinCodes) {
    const popupHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #1e1e1e; padding: 20px; border: 1px solid #444; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); z-index: 1000; border-radius: 8px; max-width: 400px; width: 100%; text-align: center; color: #fff; font-family: Arial, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #fff;">Всего ПИН-кодов (${pinCodes.length})</h3>
            </div>
            <p style="margin-bottom: 15px; color: #ccc; font-size: 14px;">
                Скопируйте эти ПИН-коды и вставьте их в соответствующее поле на странице активации.
            </p>
            <textarea style="width: 100%; height: 150px; resize: none; margin-bottom: 15px; padding: 10px; border-radius: 4px; border: 1px solid #444; background: #2d2d2d; color: #fff;">${pinCodes.join('\n')}</textarea>
            <button onclick="this.parentElement.remove()" style="background: #7428ac; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 14px;">Закрыть</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function addButtons() {
    const copyButtonHTML = `
        <button id="copy-pins-button" style="background: #7428ac; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; position: fixed; bottom: 20px; right: 20px; z-index: 1000; font-size: 14px;">
            Скопировать видимые пин-коды
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', copyButtonHTML);

    const openAllButtonHTML = `
        <button id="open-all-pins-button" style="background: #7428ac; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; position: fixed; bottom: 80px; right: 20px; z-index: 1000; font-size: 14px;">
            Открыть все видимые пин-коды
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', openAllButtonHTML);

    document.getElementById('copy-pins-button').onclick = () => {
        const unusedPinCodes = getUnusedPinCodes();
        showPinCodesPopup(unusedPinCodes);
    };

    document.getElementById('open-all-pins-button').onclick = () => {
        const buttons = document.querySelectorAll('.b-my-pin__get');
        buttons.forEach(button => {
            button.click();
        });
    };
}

// Отслеживаем появление нужного элемента на странице
const observer_get_pins = new MutationObserver((mutations) => {
    const targetElement = document.querySelector('.b-game__container');
    if (targetElement) {
        addButtons();
        observer_get_pins.disconnect();
    }
});

observer_get_pins.observe(document.body, { childList: true, subtree: true });
