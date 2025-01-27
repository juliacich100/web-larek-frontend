import { IProduct, IPresenter, TPresenterParams } from "../types";
import {ensureElement} from "../utils/utils"

export class Presenter implements IPresenter {
    protected cardTemplate: HTMLTemplateElement;

    constructor(protected params: TPresenterParams) {
        this.cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
        this.params.preview.setPresenter(this);
        this.params.basket.setPresenter(this);
        this.params.paymentForm.setPresenter(this);
        this.params.contactsForm.setPresenter(this);
        this.params.successPopup.setPresenter(this);
        this.params.viewPageContainer.setPresenter(this);
    }

    renderView() {
        this.params.server.getProductList().then(res => {
            this.params.model._items = res.items;
            const cardsList = this.params.model._items.map((item) => {
                item.image = this.params.imageUrl + item.image;
                const card = new this.params.viewItemConstructor(this.cardTemplate, this, item);
                const cardElement = card.render();
                return cardElement;
            });
            this.params.viewPageContainer.goodsContainer = cardsList;
            this.params.viewPageContainer.counter = this.params.model.order.items?.length;
        })
        .catch((err) => {
            console.log(`SERVER ERROR ${err}`);
        })
    }

    getCardData(id: string): IProduct | null {
        return this.params.model.getItem(id);
    }

    getItemFromOrder(id: string): string | null {
        return this.params.model.order.getItem(id);
    }

    getOrderItemsData(): IProduct[] {
        return this.params.model.getOrderItems();
    }

    setPopupContent<T extends { render: () => HTMLElement }>(content: T) {
        this.params.popup.content = content.render();
    }

    setOrderButtonState(item: IProduct) {
        if(this.getItemFromOrder(item.id)) {
            this.params.preview.disableOrderbutton();
        } else {
            this.params.preview.enableOrderButton();
        }
    }

    openPreview(item: IProduct) {
        this.setPopupContent(this.params.preview);
        this.params.preview.setData(item);
        this.setOrderButtonState(item);
        this.params.popup.open();
    }

    openBasket() {
        this.setPopupContent(this.params.basket);
        this.params.basket.setBasketButtonState();
        this.params.popup.open();
    }

    addItemToBasket(itemId: string) {
        this.params.model.order.addItem(itemId);
        this.renderView();
    }

    deleteItemFromBasket(itemId: string) {
        this.params.model.order.deleteItem(itemId);
        this.renderView()
    }

    openPaymentForm() {
        this.setPopupContent(this.params.paymentForm);
    }

    openContactsForm() {
        this.setPopupContent(this.params.contactsForm);
    }

    setPaymentMethod(value: string) {
        this.params.model.setPayment(value);
    }

    setAddressToForm(address: string) {
        this.params.model.setAddress(address);
    }

    openSuccessPopup() {
        this.setPopupContent(this.params.successPopup);
    }

    closeSuccessPopup() {
        this.params.popup.close();
    }

    getAddressError(): string | null {
        return this.params.model.validateAddress();
    }

    getContactError(): string | null {
        return this.params.model.validateContacts();
    }
   
    setEmail(email: string) {
        this.params.model.setEmail(email);
    }

    setPhone(phone: string) {
        this.params.model.setPhone(phone);
    }

    hasOnlyPricelessItem(): boolean {
        return this.params.model.getOrderItems().length === 1 && this.params.model.findPricelessItem();
    }

    pay() {
        if(this.params.model.findPricelessItem()) {
            this.params.model.deletePricelessFromOrder();
        }
        
        this.params.model.countTotal();
        this.params.model.saveTotal();

        this.params.server.sendOrder(this.params.model.getOrder()).then(response => {
            this.params.basket.clearBasket();
            this.params.paymentForm.clearForm();
            this.params.contactsForm.clearForm();
            this.params.model.clearOrderContacts();
            this.params.successPopup.setTotal(response.total);
            this.openSuccessPopup();
        })
        .catch((err) => {
            console.log(`SERVER ERROR ${err}`);
        })
     }
}