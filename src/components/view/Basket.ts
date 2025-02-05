import { IProduct } from "../../types";
import { IBasketItemConstructor } from "./BasketItem";
import { cloneTemplate, ensureElement, createElement } from "../../utils/utils"

export interface IBasket {
    render(total: number): HTMLElement;
	clearBasketList(): void;
	addItem(item: IProduct, index: number, onDelete: (id: string) => void): void;
	showEmptyBasketMessage(): void;
	disableBasketButton(): void;
	enableBasketButton(): void;
} 

export class Basket implements IBasket {
	protected basketElement: HTMLDivElement;
	protected basketButton: HTMLButtonElement;
	protected price: HTMLSpanElement;
	protected basketList: HTMLElement;
	protected orderTemplate: HTMLTemplateElement;
	protected itemConstructor: IBasketItemConstructor;

	constructor(
		basketTemplate: HTMLTemplateElement,
		orderTemplate: HTMLTemplateElement,
		basketItemConstructor: IBasketItemConstructor,
		onClick: () => void
	) {
		this.basketElement = cloneTemplate<HTMLDivElement>(basketTemplate);

		this.orderTemplate = orderTemplate;
		this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.basketElement);
		this.price = ensureElement<HTMLSpanElement>('.basket__price', this.basketElement);
		this.basketList = ensureElement<HTMLElement>('.basket__list', this.basketElement);
		this.itemConstructor = basketItemConstructor;

		this.basketButton.addEventListener('click', () => onClick());
	}

	render(total: number) {
		this.price.textContent = `${total} синапсов`;
		return this.basketElement;
	}

	clearBasketList() {
		this.basketList.replaceChildren();
	}

	addItem(item: IProduct, index: number, onDelete: (id: string) => void) {
		const basketItem = new this.itemConstructor(this.orderTemplate, () => onDelete(item.id));
		this.basketList.appendChild(basketItem.render({index, id: item.id, title: item.title, price: Number(item.price)}));
	}

	showEmptyBasketMessage() {
        this.basketList.replaceChildren(createElement<HTMLParagraphElement>('p', {
            textContent: 'Корзина пуста'
        }));
    }

	disableBasketButton() {
		this.basketButton.disabled = true;
	}

	enableBasketButton() {
		this.basketButton.disabled = false;
	}
}
