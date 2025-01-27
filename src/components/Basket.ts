import { IPresenter } from "../types";
import { IBasketItemConstructor } from "./BasketItem";
import { cloneTemplate } from "../utils/utils"

export interface IBasket {
    render(): HTMLElement;
    clearBasket(): void;
    setBasketButtonState(): void;
    setPresenter(presenter: IPresenter): void;
} 

export class Basket implements IBasket {
	protected presenter: IPresenter;
	protected basketElement: HTMLDivElement;
	protected basketButton: HTMLButtonElement;
	protected price: HTMLSpanElement;
	protected basketList: HTMLElement;
	protected orderTemplate: HTMLTemplateElement;
	protected itemConstructor: IBasketItemConstructor;

	constructor(
		basketTemplate: HTMLTemplateElement,
		orderTemplate: HTMLTemplateElement,
		basketItemConstructor: IBasketItemConstructor
	) {
		this.basketElement = cloneTemplate<HTMLDivElement>(basketTemplate);

		this.orderTemplate = orderTemplate;
		this.basketButton = this.basketElement.querySelector('.basket__button');
		this.price = this.basketElement.querySelector('.basket__price');
		this.basketList = this.basketElement.querySelector('.basket__list');
		this.itemConstructor = basketItemConstructor;
	}

	setPresenter(presenter: IPresenter) {
		this.presenter = presenter;
		this.basketButton.addEventListener('click', () =>
			this.presenter.openPaymentForm()
		);
	}

	render() {
		const orders = this.presenter.getOrderItemsData();
		const totalPrice = orders.reduce(
			(total, item) => total + Number(item.price),
			0
		);

		this.basketList.replaceChildren();

		orders.forEach((item, index) => {
			const basketItem = new this.itemConstructor(
				this.orderTemplate,
				{ index, id: item.id, title: item.title, price: Number(item.price) },
				() => this.handleDeleteItem(item.id)
			);
			this.basketList.appendChild(basketItem.render());
		});

		this.setPrice(totalPrice);

		return this.basketElement;
	}

	protected handleDeleteItem(id: string) {
		this.presenter.deleteItemFromBasket(id);
		this.setBasketButtonState();
		this.render();
	}

	protected setPrice(value: number) {
		this.price.textContent = `${value} синапсов`;
	}

	protected disableBasketButton() {
		this.basketButton.disabled = true;
	}

	protected enableBasketButton() {
		this.basketButton.disabled = false;
	}

	setBasketButtonState() {
		if (
			this.presenter.hasOnlyPricelessItem() ||
			this.presenter.getOrderItemsData().length === 0
		) {
			this.disableBasketButton();
		} else {
			this.enableBasketButton();
		}
	}

	clearBasket() {
		const orders = this.presenter.getOrderItemsData();
		orders.forEach((order) => {
			this.presenter.deleteItemFromBasket(order.id);
		});
		this.render();
	}
}
