class Calculator {
  constructor() {
    this.screen = document.querySelector('#screen');
    this.buttons = document.querySelectorAll('button');
    this.equalsButton = document.querySelector('#equals');
    this.clearButton = document.querySelector('#clear');
    this.leftButton = document.querySelector('#leftButton');
    this.rightButton = document.querySelector('#rightButton');
    this.dot = false;
    this.result = null;
    this.cursor = 0;
    this.calculation = '';
    this.value = '';
    this.history = [];
    this.signals = ['*', '-', '+', '%', '/', '.', 'x', '÷', ','];
    this.operators = ['x', '*', '+', '-', '%', '/'];
    this.operatorsRegex = /x|\-|\+|\%|\/|÷/;
    this.srcdoc = `<div style="font-family: sans-serif; position: absolute; right: 10px; bottom: 10px; font-weight: 600;">{VALUE}</div>`;
  }

  start() {
    this.events();
  }

  events() {
    this.buttons.forEach((button) =>
      button.addEventListener('click', (ev) => this.addToScreen(ev))
    );
    this.equalsButton.addEventListener('click', () => this.calculate());
    this.clearButton.addEventListener('click', () => this.clearScreen());
    this.leftButton.addEventListener('click', () => this.historyLeft());
    this.rightButton.addEventListener('click', () => this.historyRight());
  }

  calculate() {
    if (this.value.length <= 1 || !this.value.match(this.operatorsRegex))
      return;
    this.result = eval(this.calculation);
    this.screen.srcdoc = this.srcdoc.replace(
      '{VALUE}',
      this.result.toLocaleString('pt')
    );
    this.value = `${this.result}`;
    this.cursor = this.value.length - 1;

    this.result = null;
    this.dot = this.value.includes(',');
    this.history = [];
  }

  historyLeft() {
    if (!this.value) return;
    this.history.push(this.value[this.value.length - 1]);
    this.value = this.removeLastCharacter(this.value);
    this.screen.srcdoc = this.srcdoc.replace('{VALUE}', this.value);
  }

  historyRight() {
    if (!this.history.length) return;
    this.value += this.history.pop();
    this.screen.srcdoc = this.srcdoc.replace('{VALUE}', this.value);
  }

  clearScreen() {
    this.dot = false;
    this.value = '';
    this.cursor = 0;
    this.screen.srcdoc = this.srcdoc.replace('{VALUE}', this.value);
  }

  addToScreen(ev) {
    if (this.dot && ev.target.value === '.') return;
    if (!this.value.trim() && this.signals.includes(ev.target.value)) return;
    if (this.calculation[this.cursor - 1] === '.') this.dot = true;
    if (this.operators.includes(ev.target.value)) this.dot = false;

    //this.value += this.replaceSignals(ev.target.value);
    this.value += ev.target.value;
    if (!this.valid(this.value)) {
      this.value = this.removeLastCharacter(this.value);
    }
    if (
      this.value.length > 1 &&
      this.value.startsWith('0') &&
      !this.signals.includes(this.value[1])
    ) {
      this.value = this.value.slice(1);
    }

    this.cursor += 1;
    if (ev.target.dataset && ev.target.dataset.value)
      this.calculation += ev.target.dataset.value;
    else {
      this.calculation += ev.target.value;
    }

    if (!this.valid(this.calculation)) {
      this.calculation = this.removeLastCharacter(this.calculation);
    }

    this.screen.srcdoc = this.srcdoc.replace('{VALUE}', this.value);
  }

  valid(value) {
    const last = value[value.length - 1];
    const beforeLast = value[value.length - 2];
    if (last && beforeLast) {
      if (this.signals.includes(last) && this.signals.includes(beforeLast)) {
        return false;
      }
    }
    return true;
  }

  removeLastCharacter(value) {
    return value.slice(0, -1);
  }

  replace(string) {
    string = string.replace(/x/g, '*');
    string = string.replace(new RegExp('÷', 'g'), '/');
    return string;
  }

  repeat(string, character) {
    const regex = new RegExp(string, 'g');
    return (character.match(regex) || []).length > 1;
  }

  replaceSignals(value) {
    const map = {
      '=': '',
      '*': 'x',
      '/': '÷',
    };
    const string = value.replace(/\*|=|\//g, (match) => {
      return map[match];
    });
    return string;
  }
}

const calculator = new Calculator();
calculator.start();
