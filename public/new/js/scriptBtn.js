class Ripple {
  constructor(element) {
    this.element = element;

    this.bindMethods();
    this.addInk();
    this.addEventListeners();
  }

  bindMethods() {
    this.animate = this.animate.bind(this);
  }

  addEventListeners() {
    this.element.addEventListener('click', this.animate);
  }

  addInk() {
    this.ink = document.createElement('div');
    this.ink.className = 'ripple__ink';
    this.element.appendChild(this.ink);
  }

  animate(e) {
    this.element.classList.remove('ripple--active');
    this.ink.style.top = e.pageY - this.element.offsetTop - this.ink.clientHeight / 2 + 'px';
    this.ink.style.left = e.pageX - this.element.offsetLeft - this.ink.clientWidth / 2 + 'px';
    this.element.classList.add('ripple--active');
  }}



const ripples = document.querySelectorAll('.ripple');
Array.from(ripples).forEach(element => {
  new Ripple(element);
});