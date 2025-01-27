export class Popup {
    container: HTMLElement
    closeButton: HTMLButtonElement;
    _content: HTMLElement;

    constructor(container: HTMLElement) {
        this.closeButton = container.querySelector('.modal__close');
        this._content = container.querySelector('.modal__content');
        this.container = container;

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.closeByOverlayClick.bind(this));
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }

    closeByOverlayClick(evt: MouseEvent): void {
        if (evt.currentTarget === evt.target) {
            this.container.classList.remove('modal_active');
        }
    }
}