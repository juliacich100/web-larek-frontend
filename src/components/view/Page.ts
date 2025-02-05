import { ensureElement } from "../../utils/utils"

export interface IPage {
    goodsContainer: HTMLElement[];
    counter: number;
}

export class Page implements IPage {
    protected _goodsContainer: HTMLElement;
    protected _counter: HTMLElement;
    protected basketIcon: HTMLButtonElement;

    constructor(protected container: HTMLElement, onClick: () => void) {
        this._goodsContainer = ensureElement<HTMLElement>('.gallery', this.container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.basketIcon = ensureElement<HTMLButtonElement>('.header__basket', this.container);

        this.basketIcon.addEventListener('click', () => onClick());
    }

    set goodsContainer(items: HTMLElement[]) {
        this._goodsContainer.replaceChildren(...items);
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    };
}