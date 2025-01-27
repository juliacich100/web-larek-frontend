import { TBasketItem } from "../types";
import { cloneTemplate } from "../utils/utils"

export interface IBasketItemConstructor {
    new (orderTemplate: HTMLTemplateElement, itemData: TBasketItem, onDelete: () => void): IBasketItem;
}

export interface IBasketItem {
    render(): HTMLDivElement;
}

export class BasketItem implements IBasketItem {
    protected itemData: TBasketItem;
    protected index: HTMLSpanElement;
    protected title: HTMLSpanElement;
    protected itemPrice: HTMLSpanElement;
    protected orderElement: HTMLDivElement;
    protected deleteIcon: HTMLElement;

    constructor(orderTemplate: HTMLTemplateElement, itemData: TBasketItem, onDelete: () => void) {
        this.orderElement = cloneTemplate<HTMLDivElement>(orderTemplate);
        
        this.deleteIcon = this.orderElement.querySelector('.basket__item-delete');
        this.index = this.orderElement.querySelector('.basket__item-index');
        this.title = this.orderElement.querySelector('.card__title');
        this.itemPrice = this.orderElement.querySelector('.card__price');
        this.itemData = itemData;

        this.deleteIcon.addEventListener('click', onDelete);
        this.setText();
    }

    render(): HTMLDivElement {
        return this.orderElement;
    }

    protected setText() {
        this.index.textContent = String(this.itemData.index + 1);
        this.title.textContent = this.itemData.title;
        this.itemPrice.textContent = this.itemData.price === 0 ? 'Бесценно' : `${this.itemData.price} синапсов`;
    }
}