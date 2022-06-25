import puppeteer from "puppeteer";
import * as fs from 'fs';

import { AMAZON, EBAY, WALMART, CRAIGSLIST, TARGET } from './constants';
import { Coordinates, Inputs } from './interfaces'

const amazonSelector1 = '#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div.s-result-item.s-widget.s-widget-spacing-large.AdHolder.s-flex-full-width'

// div containing each individual product returned from our search
const amazonSelector2 = '#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6)'

// span containing the products price
const amazonSelector3 = "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen"

// list item shortened
const amazonSelector4 = 'div.s-result-item'

// span containing the products price
const amazonSelector5 = "div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen"

// span containing the products price
const amazonSelector6 = "div > div > div > div > div > div > div > div > div > div > div > div > div > a > span > span.a-offscreen"




class Search {
    fullURL: String;
    browser: any;
    page: any;
    firstParagraph: any;
    srcTxt: any;

    webSite: String;
    productName: String;
    min_price: Number;
    max_price: Number;
	// selector: String;

	constructor(inputs: Inputs) {

        const makeFullURL = (input: Inputs) => {
            switch (input.webSite) {
                case AMAZON:
                    return `https://www.amazon.com/s?k=${input.productName}&rh=p_36%3A${input.min_price}00-${input.max_price}00`

                case EBAY: 
                    return `https://www.ebay.com/sch/i.html?&_nkw=${input.productName}&_udlo=${input.min_price}&_udhi=${input.max_price}`

                case WALMART: 
                    return `https://www.walmart.com/search?q=${input.productName}&min_price=${input.min_price}&max_price=${input.max_price}`

                case CRAIGSLIST:
                    return `https://austin.craigslist.org/search/sss?query=${input.productName}&min_price=${input.min_price}&max_price=${input.max_price}`

                case TARGET: 
                	return `https://www.target.com/s?searchTerm=${input.productName}&minPrice=${input.min_price}&maxPrice=${input.max_price}`
            
                default:
                    '';
            }
			return ''
        }

		// this.selector = this.in

        this.fullURL = makeFullURL(inputs)

        this.webSite = inputs.webSite;
        this.productName = inputs.productName;
        this.min_price = inputs.min_price;
        this.max_price = inputs.max_price;
	}
	async connect() {
		this.browser = await puppeteer.launch();
		this.page = await this.browser.newPage();
		await this.page.goto(this.fullURL);
	}
	disConnect() {
		this.browser.close();
	}

	printThis() {
		console.log(this);
	}
	printURL() {
		console.log(this.fullURL);
	}
	printProduct() {
		console.log(this.productName);
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
			// path: `../images/screenshots/fullpage/screenshot${Date.now()}.png`,
			path: `../assets/screenshots/fullpage/screenshot${Date.now()}.png`,
			fullPage: true,
		});
	}
	async OPERATION_getTextContent_one(selector: String) {
		return await this.page.$eval(selector, (el: any) => el.textContent);
	}
	async OPERATION_getTextContent_all(selector: String) {
		const array: String[] = []
		// first select all $$eval(item selector) to get every product on the page, then for each item, select the price $eval(price selector)
		await this.page.$eval(selector, (el: any) => {
			const amazonSelector = "div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen";
			const price = el.$eval(amazonSelector, (el: any) => el.textContent)
			array.push(price)
		});
		return array
	}
	async OPERATION_getTextContent_all2(selector: String) {
		// const array: String[] = []
		const amazonSelector = "div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen";
		const amazonSelector4 = 'div.s-result-item'

		
		// return Array.from(await this.page.$$eval(selector, (el:any) => {
			
			// 	return el.$eval(amazonSelector, (el:any) => el.textContent)
			// }))
			
			// return await this.page.$$(selector)

			const result =  await this.page.$$(amazonSelector4)

			const newResults = await result.map(
				async function(el:any) {
					return await el.$eval('div', ((subEl: any) => subEl.textContent))
				}
			)



			// const newResult = await result.$('div')

			// .$('div > a > span > span.a-offscreen')

			return newResults
			// return newResult


			// fs.writeFileSync('../assets/data.json', JSON.stringify(result));
			
			// .$(amazonSelector)
		//.$(amazonSelector).textContent
		
		// return result


		
		
		// .map(x => {
		// 	x.$eval(amazonSelector, el => el.textContent)
		// })
		// return array
	}

	async OPERATION_getFiveProducts(selector: String) {
		let result = await this.page.$$eval(selector, )
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
	async getTextContent_one(selector: String) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPERATION_getTextContent_one(selector))
			.then((result) => console.log(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async getTextContent_all(selector: String) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			// .then(() => this.OPERATION_getTextContent_all(selector))
			.then(() => this.OPERATION_getTextContent_all2(selector))
			.then((result) => console.log(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async opperation_2(input: String) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => console.log(input))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
}

const searchInputs1: Inputs = {
	webSite: AMAZON,
    productName: 'iPhone',
    min_price: 100,
    max_price: 400,
	condition: 'New'
}

const search1 = new Search(searchInputs1)
search1.getTextContent_all(amazonSelector4)

export {Search}