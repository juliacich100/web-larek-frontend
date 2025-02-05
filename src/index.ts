import './scss/styles.scss';
import { Presenter } from "./components/Presenter";
import { Card } from "./components/view/Card";
import { Preview } from './components/view/Preview';
import { Page } from "./components/view/Page";
import { Popup } from './components/view/Popup';
import { ContactsForm } from './components/view/ContactsForm';
import {SuccessForm} from './components/view/SuccessForm';
import { ServerApi } from './components/ServerApi';
import { Api } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { PaymentForm } from './components/view/PaymentForm';
import { Basket } from './components/view/Basket';
import { BasketItem } from './components/view/BasketItem';
import { TPresenterParams } from './types';
import {ensureElement} from "./utils/utils";
import { ProductsModel, OrderModel, ServerOrder } from './components/model/model';

const fullCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const page = ensureElement<HTMLElement>(".page");
const modal = ensureElement<HTMLElement>('.modal');

const presenterParams: TPresenterParams = {
    server: new ServerApi(new Api(API_URL)),
    itemModel: new ProductsModel(),
    orderModel: new OrderModel(new ServerOrder()),
    viewPageContainer: new Page(page, () => presenter.openBasket()),
    viewItemConstructor: Card,
    preview: new Preview(fullCardTemplate, (id: string) => {presenter.handleOrderButtonClick(id)}),
    popup: new Popup(modal),
    basket: new Basket(basketTemplate, orderTemplate, BasketItem, () => presenter.openPaymentForm()),
    paymentForm: new PaymentForm(paymentTemplate, (payment: string, address: string) => presenter.handleAdressInputChange(payment, address), 
    () => presenter.openContactsForm()),
    contactsForm: new ContactsForm(contactsTemplate, (email: string, phone: string) => presenter.handleContactsInputChange(email, phone), 
    () => presenter.pay()),
    successPopup: new SuccessForm(successTemplate, () => presenter.closeSuccessPopup()),
    imageUrl: CDN_URL
}

const presenter = new Presenter(presenterParams);
presenter.renderProductsList();



