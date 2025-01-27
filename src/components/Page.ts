import { IPresenter } from "../types";

export interface IPage {
    goodsContainer: HTMLElement[];
    counter: number;
    setPresenter(presenter: IPresenter): void;
}

export class Page implements IPage {
    protected _goodsContainer: HTMLElement;
    protected _counter: HTMLElement;
    protected basketIcon: HTMLButtonElement;
    protected presenter: IPresenter;

    constructor(protected container: HTMLElement) {
        this._goodsContainer = this.container.querySelector('.gallery');
        this._counter = this.container.querySelector('.header__basket-counter');
        this.basketIcon = this.container.querySelector('.header__basket');

        this.basketIcon.addEventListener('click', () => {
            this.handleClick();
        });
    }

    set goodsContainer(items: HTMLElement[]) {
        this._goodsContainer.replaceChildren(...items);
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    };

    setPresenter(presenter: IPresenter) {
        this.presenter = presenter;
    }

    protected handleClick() {
        this.presenter.openBasket();
    }
}