class DiceRoller {
    constructor() {
        this.rollHistory = [];
        this.init();
    }

    init() {
        this.rollBtn = document.getElementById('roll-btn');
        this.resultDisplay = document.getElementById('result-display');
        this.historyDisplay = document.getElementById('history');
        this.diceType = document.getElementById('dice-type');
        this.quantity = document.getElementById('quantity');

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

    rollDice() {
        const sides = parseInt(this.diceType.value);
        const quantity = parseInt(this.quantity.value);

        if (isNaN(sides) || isNaN(quantity) || sides <= 0 || quantity <= 0) {
            this.showError('Некорректные значения');
            return;
        }

        let total = 0;
        let rolls = [];

        for (let i = 0; i < quantity; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }

        this.displayResult(rolls, total, sides, quantity);
        this.addToHistory(rolls, total, sides, quantity);
    }

    displayResult(rolls, total, sides, quantity) {
        let resultText = '';

        if (quantity === 1) {
            resultText = `${total}`;
        } else {
            resultText = `${total} (${rolls.join(' + ')})`;
        }

        this.resultDisplay.textContent = resultText;

        // Анимация
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
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new DiceRoller();
});