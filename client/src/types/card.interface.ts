export interface ICard {
	id?: number;
	cardNumber: string;
	cvvCode: number;
	cardValidatePeriod: Date;
	balance: number;
	userId?: string;
	status: "ACTIVE" | "BLOCKED" | "EXPIRED";
	valuta: string;
}
