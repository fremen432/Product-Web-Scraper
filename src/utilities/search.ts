import puppeteer from "puppeteer";

import { AMAZON, EBAY, WALMART, CRAIGSLIST, TARGET } from './constants';
import { Coordinates, Inputs } from './interfaces'

const searchString = '' // maditory
const minPrice = ''     // optional
const maxPrice = ''     // optional
const condition = 10    // optional default to 'all conditions'

const amazonBaseURL = `https://www.amazon.com/s?k=
${searchString}+between+%24${minPrice}+and+%24${maxPrice}`

// %24 = '$' dollar sign symbol
const ebayBaseURL = `https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313
&_nkw=${searchString}+between+%24${minPrice}+and+%24${maxPrice}`

const walmartBaseURL = `https://www.walmart.com/search?q=${searchString}+between+%24${minPrice}+and+%24${maxPrice}`

const craigslistBaseURL = `https://austin.craigslist.org/search/sss?
query=${searchString}
${minPrice && "&min_price=" + minPrice}
${maxPrice && "&max_price=" + maxPrice}
&condition=${condition}`
/* 
    Craigslist Conditions:

    new = 10
    like new = 20
    excelent = 30
    good = 40
    fair = 50
    salvage = 60
*/

const targetBaseURL = `https://www.target.com/s?
searchTerm=iphone
&minPrice=100
&maxPrice=200`

class Search {
    baseURL: String;
    searchTerm: String;
    fullURL: String;
    browser: any;
    page: any;
    firstParagraph: any;
    srcTxt: any;

    webSite: String;
    productName: String;
    min_price: Number;
    max_price: Number;
    condition: Number;
    fullURL: String;

	// constructor(baseURL: String, searchTerm: String) {
	// 	this.baseURL = baseURL;
	// 	this.searchTerm = searchTerm.replace(" ", "_");
	// 	this.fullURL = `${this.baseURL} ${this.searchTerm}`;
	// }
	constructor(inputs: Inputs) {

        const makeFullURL = (input: Inputs) => {
            switch (input.webSite) {
                case AMAZON: {

                    const base = `https://www.amazon.com/s?k=${input.productName}`

                    const minOnly = `${base} greater than ${input.min_price}`
                    const maxOnly = `${base} less than $${input.max_price}`
                    const minAndMax = `${base} between $${input.min_price} and $${input.max_price}`

                    if (input.min_price && input.max_price) return minAndMax
                    if (!input.min_price && input.max_price) return maxOnly
                    if (input.min_price && !input.max_price) return minOnly

                    return base
                }

                case EBAY: {

                    const base = `https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2334524.m570.l1313&_nkw=${input.productName}`

                    const minOnly = `${base} greater than ${input.min_price}`
                    const maxOnly = `${base} less than $${input.max_price}`
                    const minAndMax = `${base} between $${input.min_price} and $${input.max_price}`

                    if (input.min_price && input.max_price) return minAndMax
                    if (!input.min_price && input.max_price) return maxOnly
                    if (input.min_price && !input.max_price) return minOnly

                    return base
                }
                case WALMART: {

                    const base = `https://www.walmart.com/search?q=${input.productName}`

                    const minOnly = `${base} greater than ${input.min_price}`
                    const maxOnly = `${base} less than $${input.max_price}`
                    const minAndMax = `${base} between $${input.min_price} and $${input.max_price}`

                    if (input.min_price && input.max_price) return minAndMax
                    if (!input.min_price && input.max_price) return maxOnly
                    if (input.min_price && !input.max_price) return minOnly

                    return base
                }
                case CRAIGSLIST: {

                    // const condition = 

                    const base = `https://austin.craigslist.org/search/sss?
                    query=${input.productName}
                    &min_price=${input.min_price}
                    &max_price=${input.max_price}
                    `
                    return base
                }
                case TARGET: {

                    const base = `https://www.target.com/s?
                    searchTerm=${input.productName}
                    &minPrice=${input.min_price}
                    &maxPrice=${input.max_price}
                    `


                    // const minOnly = `${base}${min}`
                    // const maxOnly = `${base}${max}`
                    // const minAndMax = `${base}${min}${max}`

                    // if (input.min_price && input.max_price) return minAndMax
                    // if (!input.min_price && input.max_price) return maxOnly
                    // if (input.min_price && !input.max_price) return minOnly

                    return base
                }
            
                default:
                    break;
            }
        }

        this.webSite = inputs.webSite;
        this.productName = inputs.productName;
        this.min_price = inputs.min_price;
        this.max_price = inputs.max_price;
        this.condition = inputs.condition;

        this.fullURL = makeFullURL(inputs: Inputs)


		this.baseURL = makeBaseURL(inputs.webSite);
		this.searchTerm = searchTerm.replace(" ", "_");
		// this.fullURL = `${this.baseURL} ${this.searchTerm}`;
	}
	async connect() {
		this.browser = await puppeteer.launch();
		this.page = await this.browser.newPage();
		await this.page.goto(this.fullURL);
	}
	disConnect() {
		this.browser.close();
	}

	printSearchTerm() {
		console.log(this.searchTerm);
	}
	printURL() {
		console.log(this.fullURL);
	}
	printProduct() {
		console.log(this);
	}
	printMine() {
		let element_1 = this.firstParagraph;
		let element_2 = this.srcTxt;

		console.log({ element_1, element_2 });
	}

	async OPPERATION_getCoordinates(thisSelector: String) {
		return await this.page.$eval(thisSelector, (el: any) => {
			let domRect = el.getBoundingClientRect();

			let x = Number(domRect.left.toFixed());
			let y = Number(domRect.top.toFixed());
			let height = Number(domRect.height.toFixed());
			let width = Number(domRect.width.toFixed());

			return { x, y, height, width };
		});
	}
	async OPPERATION_getScreenShot_clip(coordinates: Coordinates) {
		let x = coordinates.x;
		let y = coordinates.y;
		let width = coordinates.width;
		let height = coordinates.height;

		await this.page.screenshot({
			path: `../images/screenshots/clips/screenshot${Date.now()}.png`,
			clip: { x, y, width, height },
		});
	}
	async OPPERATION_getScreenShot_fullpage() {
		await this.page.screenshot({
			path: `../images/screenshots/fullpage/screenshot${Date.now()}.png`,
			fullPage: true,
		});
	}
	async OPERATION_getFirstParagraph(selector: String) {
		return await this.page.$eval(selector, (el: any) => el.textContent);
	}

	async getScreenShot_clip(selector: String) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPPERATION_getCoordinates(selector))
			.then((result) => this.OPPERATION_getScreenShot_clip(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async getScreenShot_fullpage() {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPPERATION_getScreenShot_fullpage())
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async getFirstParagraph(selector: String) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPERATION_getFirstParagraph(selector))
			.then((result) => console.log(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async opperation_2(input: String) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => console.log(input))
			.then(() => this.disConnect());
	}
}
export {Search}