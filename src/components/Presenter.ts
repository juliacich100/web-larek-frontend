import { IProduct, IPresenter, TPresenterParams } from "../types";
import {ensureElement} from "../utils/utils"

export class Presenter implements IPresenter {
    protected cardTemplate: HTMLTemplateElement;

    constructor(protected params: TPresenterParams) {
        this.cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    }

    renderProductsList() {
        this.params.server.getProductList().then(res => {
            this.params.itemModel.items = res.items;
            const cardsList = this.params.itemModel.items.map((item) => {
                item.image = this.params.imageUrl + item.image;
                const card = new this.params.viewItemConstructor(this.cardTemplate, (item) => this.openPreview(item));
                const cardElement = card.render(item);
                return cardElement;
            });
            this.params.viewPageContainer.goodsContainer = cardsList;
            this.updateBasketCounter();
        })
        .catch((err) => {
            console.log(`SERVER ERROR ${err}`);
        })
    }

    renderBasketItems() {
        const orders = this.getOrderItemsData();
		
        if(orders.length > 0) {
            this.params.basket.clearBasketList();
            orders.forEach((item, index) => {
			this.params.basket.addItem(item, index, this.handleDeleteItem.bind(this));
		})
        } else {
            this.params.basket.showEmptyBasketMessage();
        }
    }

    protected handleDeleteItem(id: string) {
		this.deleteItemFromBasket(id);
		this.setBasketButtonState();
        this.params.basket.render(this.getTotalPrice());
        this.renderBasketItems();
	}

    protected getTotalPrice(): number {
        return this.params.itemModel.countTotal(this.getOrderItemsData());
    }

    protected setBasketButtonState() {
		if (
			this.hasOnlyPricelessItem() ||
			this.getOrderItemsData().length === 0
		) {
			this.params.basket.disableBasketButton();
		} else {
			this.params.basket.enableBasketButton();
		}
	}

    handleOrderButtonClick(id: string) {
        const itemExistsInOrder = this.getItemFromOrder(id);

        if (!itemExistsInOrder) {
            this.addItemToBasket(id);
        }
        this.params.preview.disableOrderbutton();
    }

    protected getOrderIds(): string[] {
        return this.params.orderModel.getOrderItems();
    }

    protected getItemFromOrder(id: string): string | null {
        return this.params.orderModel.getItem(id);
    }

    protected getOrderItemsData(): IProduct[] {
        const orderItems = this.getOrderIds();
        return orderItems.map(id => this.params.itemModel.getProduct(id)).filter(item => item !== null) as IProduct[];
    }

    protected setPopupContent<T extends { render: (params?: any) => HTMLElement }>(content: T, params?: any) {
        this.params.popup.content = content.render(params);
    }

    protected setOrderButtonState(item: IProduct) {
        if(this.getItemFromOrder(item.id)) {
            this.params.preview.disableOrderbutton();
        } else {
            this.params.preview.enableOrderButton();
        }
    }

    openPreview(item: IProduct) {
        this.setPopupContent(this.params.preview, item);
        this.setOrderButtonState(item);
        this.params.popup.open();
    }

    openBasket() {
        this.renderBasketItems();
        this.setPopupContent(this.params.basket, this.getTotalPrice());
        this.setBasketButtonState();
        this.params.popup.open();
    }

    protected addItemToBasket(itemId: string) {
        this.params.orderModel.addItem(itemId);
        this.updateBasketCounter();
    }

    protected deleteItemFromBasket(itemId: string) {
        this.params.orderModel.deleteItem(itemId);
        this.updateBasketCounter();
    }

    openPaymentForm() {
        this.setPopupContent(this.params.paymentForm);
    }

    openContactsForm() {
        this.setPopupContent(this.params.contactsForm);
    }

    handleAdressInputChange(payment: string | null, address: string) {
        this.params.orderModel.setPayment(payment);
        this.params.orderModel.setAddress(address);
        const error: string | null = this.getAddressError();
        this.params.paymentForm.setInputError(error);

        if(this.isPaymentFormValid(payment)) {
            this.params.paymentForm.setSubmitState(true);
        } else {
            this.params.paymentForm.setSubmitState(false);
        }
    }

    handleContactsInputChange(email: string, phone: string) {
        this.params.orderModel.setEmail(email);
        this.params.orderModel.setPhone(phone);
        const error: string | null = this.getContactError();
        this.params.contactsForm.setInputError(error);
    
        if (this.isContactsFormValid()) {
            this.params.contactsForm.setSubmitState(true);
        } else {
            this.params.contactsForm.setSubmitState(false);
        }
    }

    protected isContactsFormValid(): boolean {
        return !this.getContactError();
    }

    protected isPaymentFormValid(payment: string | null): boolean {
        return !this.getAddressError() && Boolean(payment);
    }

    openSuccessPopup(total: number) {
        this.setPopupContent(this.params.successPopup, total);
    }

    closeSuccessPopup() {
        this.params.popup.close();
    }

    protected getAddressError(): string | null {
        return this.params.orderModel.validateAddress();
    }

    protected getContactError(): string | null {
        return this.params.orderModel.validateContacts();
    }

    protected hasOnlyPricelessItem(): boolean {
        const orderItems = this.getOrderIds();
        return orderItems.length === 1 && Boolean(this.params.itemModel.findPricelessProduct(orderItems));
    }

    protected clearBasket() {
        this.params.orderModel.clearOrderFields();
        this.updateBasketCounter();
    }

    protected updateBasketCounter() {
        this.params.viewPageContainer.counter = this.params.orderModel.order.items?.length;
    }

    pay() {
        const orderItems = this.getOrderIds();
        const priceless = this.params.itemModel.findPricelessProduct(orderItems);
        if(priceless) {
            this.params.orderModel.deleteItem(priceless);
        }
        
        this.params.orderModel.setTotal(this.params.itemModel.countTotal(this.getOrderItemsData()));

        this.params.server.sendOrder(this.params.orderModel.getOrder()).then(response => {
            this.clearBasket();
            this.params.paymentForm.resetForm();
            this.params.contactsForm.resetForm();
            this.openSuccessPopup(response.total);
        })
        .catch((err) => {
            console.log(`SERVER ERROR ${err}`);
        })
     }
}