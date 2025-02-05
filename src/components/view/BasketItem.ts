import { TBasketItem } from "../../types";
import { BaseItem, IBaseItem } from "./BaseItem";
import { ensureElement } from "../../utils/utils"

export interface IBasketItemConstructor {
    new (orderTemplate: HTMLTemplateElement, onDelete: (id: string) => void): IBasketItem<TBasketItem>;
}

export interface IBasketItem<TBasketItem> extends IBaseItem<TBasketItem> {}

export class BasketItem extends BaseItem<TBasketItem> implements IBasketItem<TBasketItem> {
    protected id: string;
    protected index: HTMLSpanElement;
    protected title: HTMLSpanElement;
    protected itemPrice: HTMLSpanElement;
    protected deleteIcon: HTMLElement;

    constructor(orderTemplate: HTMLTemplateElement, onDelete: (id: string) => void) {
        super(orderTemplate);

        this.deleteIcon = ensureElement<HTMLElement>('.basket__item-delete', this.element);
        this.index = ensureElement<HTMLSpanElement>('.basket__item-index', this.element);
        this.title = ensureElement<HTMLSpanElement>('.card__title', this.element);
        this.itemPrice = ensureElement<HTMLSpanElement>('.card__price', this.element);
    
        this.deleteIcon.addEventListener('click', () => onDelete(this.id));
    }

    render(itemData: TBasketItem): HTMLElement {
        this.id = itemData.id;
        this.index.textContent = String(itemData.index + 1);
        this.title.textContent = itemData.title;
        this.itemPrice.textContent = itemData.price === 0 ? 'Бесценно' : `${itemData.price} синапсов`;
        return this.element;
    }
}