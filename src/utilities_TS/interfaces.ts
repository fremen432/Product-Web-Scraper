export interface Coordinates {
	x: number;
	y: number;
	height: number;
	width: number;
}

export interface Inputs {
	productName: string;
	// productName_string: string;
	// productName_url: string;

	min_price: string;
	max_price: string;
	condition: string;
}

export interface Output {
	productName: string;
	min_price: string;
	max_price: string;
	condition: string;
	// productName_string: string;
	// productName_url: string;
}
