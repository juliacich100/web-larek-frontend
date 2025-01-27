import { IProduct, IServerOrder, IModel } from '../../types';

export class Model implements IModel {
	_items: IProduct[] = [];
	order: IServerOrder;

	constructor(order: IServerOrder) {
		this.order = order;
	}

	set items(data: IProduct[]) {
		this._items = data;
	}

	get items() {
		return this._items;
	}

	getItem(id: string): IProduct | null {
		const item = this._items.find((item) => item.id === id);
		return item;
	}

	getOrder(): IServerOrder {
		return this.order;
	}

	setPayment(value: string) {
		this.order.setPayment(value);
	}

	setAddress(value: string) {
		this.order.setAddress(value);
	}

	setEmail(email: string) {
		this.order.setEmail(email);
	}

	setPhone(phone: string) {
		this.order.setPhone(phone);
	}

	validateContacts() {
		if (!this.order.getEmail()) {
			return 'Необходимо указать email';
		}
		if (!this.order.getPhone()) {
			return 'Необходимо указать телефон';
		}
		return null;
	}

	validateAddress() {
		if (!this.order.getAddress()) {
			return 'Необходимо указать адрес';
		}
		return null;
	}

	getOrderItems(): IProduct[] {
		let ordersList: IProduct[] = [];
		this.order.items.forEach((id) => {
			const item = this.getItem(id);
			if (item) {
				ordersList.push(item);
			}
		});
		return ordersList;
	}

	findPricelessItem() {
		const arr = this.getOrderItems();

		const item = arr.some((item) => {
			return item.price === null;
		});
		return item;
	}

	deletePricelessFromOrder() {
		const arr = this.getOrderItems();

		const item = arr.find((item) => {
			return item.price === null;
		});
		this.order.deleteItem(item.id);
	}

	countTotal() {
		const ids = this.order.items;
		const arr = this._items;
		const resultArray: IProduct[] = [];
		let total = 0;

		ids.filter((id) => {
			arr.some((item) => {
				if (item.id === id) {
					resultArray.push(item);
				}
			});
		});

		resultArray.forEach((item) => {
			total += item.price;
		});
		return total;
	}

	saveTotal() {
		this.order.setTotal(this.countTotal());
	}

	clearOrderContacts() {
		this.order.clearContacts();
	}
}

export class ServerOrder implements IServerOrder {
	payment: 'card' | 'cash';
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[] | null = [];

	addItem(id: string) {
		this.items?.push(id);
	}

	getItem(id: string) {
		const item = this.items.find((itemId) => itemId === id);
		return item;
	}

	deleteItem(id: string) {
		const idToDelete = id;
		this.items = this.items?.filter((id) => id != idToDelete);
	}

	setPayment(value: string) {
		switch (value) {
			case 'Онлайн':
				this.payment = 'card';
				break;
			case 'При получении':
				this.payment = 'cash';
		}
	}

	setAddress(value: string) {
		this.address = value;
	}

	setEmail(value: string) {
		this.email = value;
	}

	setPhone(value: string) {
		this.phone = value;
	}

	setTotal(total: number) {
		this.total = total;
	}

	getAddress() {
		return this.address;
	}

	getEmail() {
		return this.email;
	}

	getPhone() {
		return this.phone;
	}

	clearContacts() {
		this.address = '';
		this.email = '';
		this.phone = '';
	}
}
