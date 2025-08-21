class DiceRoller {
    constructor() {
        this.rollHistory = [];
        this.isRolling = false;
        this.init();
    }

    init() {
        this.rollBtn = document.getElementById('roll-btn');
        this.resultDisplay = document.getElementById('result-display');
        this.historyDisplay = document.getElementById('history');
        this.diceType = document.getElementById('dice-type');
        this.quantity = document.getElementById('quantity');
        this.diceContainer = document.getElementById('dice-container');

        this.rollBtn.addEventListener('click', () => this.rollDice());

        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dice = e.target.dataset.dice;
                this.diceType.value = dice;
                if (dice === '6') this.quantity.value = 3;
                else this.quantity.value = 1;
                this.rollDice();
            });
        });
    }

    async rollDice() {
        if (this.isRolling) return;

        this.isRolling = true;
        this.rollBtn.disabled = true;

        const sides = parseInt(this.diceType.value);
        const quantity = parseInt(this.quantity.value);

        if (isNaN(sides) || isNaN(quantity) || sides <= 0 || quantity <= 0) {
            this.showError('Некорректные значения');
            this.isRolling = false;
            this.rollBtn.disabled = false;
            return;
        }

        // Очищаем контейнер с кубиками
        this.diceContainer.innerHTML = '';
        this.resultDisplay.textContent = 'Бросок...';

        let total = 0;
        let rolls = [];
        const diceElements = [];

        // Создаем элементы кубиков
        for (let i = 0; i < quantity; i++) {
            const die = document.createElement('div');
            die.className = 'die rolling';
            die.textContent = '?';
            this.diceContainer.appendChild(die);
            diceElements.push(die);
        }

        // Ждем немного перед началом анимации
        await this.sleep(100);

        // Бросаем кубики
        for (let i = 0; i < quantity; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;

            // Анимируем результат
            this.animateDie(diceElements[i], roll, sides);

            // Небольшая задержка между бросками
            if (i < quantity - 1) await this.sleep(300);
        }

        // Ждем завершения анимации
        await this.sleep(1000);

        this.displayResult(rolls, total, sides, quantity);
        this.addToHistory(rolls, total, sides, quantity);

        this.isRolling = false;
        this.rollBtn.disabled = false;
    }

    animateDie(dieElement, value, sides) {
        // Убираем класс анимации броска
        dieElement.classList.remove('rolling');

        // Добавляем специальные классы для критических успехов/провалов
        if (sides === 20) {
            if (value === 20) {
                dieElement.classList.add('critical');
            } else if (value === 1) {
                dieElement.classList.add('fail');
            }
        }

        // Устанавливаем значение
        dieElement.textContent = value;
    }

    displayResult(rolls, total, sides, quantity) {
        let resultText = '';

        if (quantity === 1) {
            resultText = `${total}`;
            // Добавляем emoji для d20
            if (sides === 20) {
                if (total === 20) resultText += ' 🎉'; // Критический успех
                if (total === 1) resultText += ' 💀'; // Критический провал
            }
        } else {
            resultText = `${total} (${rolls.join(' + ')})`;
        }

        this.resultDisplay.textContent = resultText;

        // Анимация результата
        this.resultDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.resultDisplay.style.transform = 'scale(1)';
        }, 150);
    }

    addToHistory(rolls, total, sides, quantity) {
        const time = new Date().toLocaleTimeString();
        let historyText = '';

        if (quantity === 1) {
            historyText = `[${time}] d${sides}: ${total}`;
        } else {
            historyText = `[${time}] ${quantity}d${sides}: ${total} (${rolls.join(', ')})`;
        }

        this.rollHistory.unshift(historyText);
        if (this.rollHistory.length > 5) {
            this.rollHistory.pop();
        }

        this.historyDisplay.innerHTML = this.rollHistory.join('<br>');
    }

    showError(message) {
        this.resultDisplay.textContent = 'Ошибка!';
        this.historyDisplay.textContent = message;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new DiceRoller();
});