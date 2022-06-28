import puppeteer from "puppeteer";
import * as fs from "fs";

import { AMAZON, EBAY, WALMART, CRAIGSLIST, TARGET } from "./constants.js";

// returns a non-visible span containing the price
const amazonSelector1 =
	"#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(5) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen";

// returns the div of the first product in the results. it is technically the 4th search result
const amazonSelector2 =
	"#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(5)";

// returns product html element
const amazonSelector3 = "div.s-result-item";
const amazonSelector13 = "div.s-result-list div.s-result-item";

// returns span of price
const amazonSelector4 = "span.a-price > span.a-offscreen";

// returns nested spans of prices
const amazonSelector5 = "a.a-size-base > span.a-price";

const amazonSelector6 =
	"div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > div > div > div > div";

class Search {
	fullURL;
	browser;
	page;
	firstParagraph;
	srcTxt;

	webSite;
	productName;
	min_price;
	max_price;
	// selector;

	constructor(inputs) {
		const makeFullURL = (input) => {
			switch (input.webSite) {
				case AMAZON:
					return `https://www.amazon.com/s?k=${input.productName}&rh=p_36%3A${input.min_price}00-${input.max_price}00`;

				case EBAY:
					return `https://www.ebay.com/sch/i.html?&_nkw=${input.productName}&_udlo=${input.min_price}&_udhi=${input.max_price}`;

				case WALMART:
					return `https://www.walmart.com/search?q=${input.productName}&min_price=${input.min_price}&max_price=${input.max_price}`;

				case CRAIGSLIST:
					return `https://austin.craigslist.org/search/sss?query=${input.productName}&min_price=${input.min_price}&max_price=${input.max_price}`;

				case TARGET:
					return `https://www.target.com/s?searchTerm=${input.productName}&minPrice=${input.min_price}&maxPrice=${input.max_price}`;

				default:
					"";
			}
			return "";
		};

		this.fullURL = makeFullURL(inputs);

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
	disConnect = () => this.browser.close();
	printThis = () => console.log(this);
	printURL = () => console.log(this.fullURL);
	printProduct = () => console.log(this.productName);

	async OPPERATION_getCoordinates(thisSelector) {
		return await this.page.$eval(thisSelector, (el) => {
			let domRect = el.getBoundingClientRect();

			let x = Number(domRect.left.toFixed());
			let y = Number(domRect.top.toFixed());
			let height = Number(domRect.height.toFixed());
			let width = Number(domRect.width.toFixed());

			return { x, y, height, width };
		});
	}
	async OPPERATION_getScreenShot_clip(coordinates) {
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
	async OPERATION_getTextContent_one(selector) {
		return await this.page.$eval(selector, (el) =>
			JSON.stringify(el.textContent)
		);
	}
	async OPERATION_getProductInfo(selector_Parent, selector_child1) {
		// first select all $$eval(item selector) to get every product on the page, then for each item, select the price $eval(price selector)

		const results = await this.page.evaluate(() => {
			const resultArray = [];
			const parent =
				"div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > div > div > div > div";
			const child_price = "a > span > span.a-offscreen";
			const selector_productName = "h2 > a.s-link-style > span";
			const selector_stars = "a > i.a-icon-star-small > span";
			const selector_link =
				"#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span > div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20.s-list-col-left > div > div.s-product-image-container.aok-relative.s-image-overlay-grey.s-text-center.s-padding-left-small.s-padding-right-small.s-flex-expand-height > div > span > a";

			const resObj = document.querySelectorAll(parent);

			for (el of resObj) {
				if (
					!el.textContent.includes("Sponsored") &&
					el.textContent.match(/\$(\d+)\.(\d{2})/g)
				) {
					const productName =
						el.querySelector(selector_productName).textContent;
					const price = el.querySelector(child_price).textContent;
					const stars = el.querySelector(selector_stars).textContent;
					const link = el.querySelector(selector_link).href;

					resultArray.push({
						ProductName: productName,
						Price: price,
						StarRating: stars,
						ProductLink: link,
					});
				}
			}

			return resultArray;
		});
		// });
		// return resObj;

		// const resObj = document.querySelectorAll(parent);

		// for (el of resObj) {
		// 	if (
		// 		!el.textContent.includes("Sponsored") &&
		// 		el.textContent.match(/\$(\d+)\.(\d{2})/g)
		// 	) {
		// 		const productName = el.$(selector_productName).textContent;
		// 		const price = el.querySelector(child_price).textContent;
		// 		const stars = el.querySelector(selector_stars).textContent;
		// 		const link = el.querySelector(selector_link).href;

		// 		resultArray.push({
		// 			ProductName: productName,
		// 			Price: price,
		// 			StarRating: stars,
		// 			ProductLink: link,
		// 		});
		// 	}
		// }
		return results;
	}
	OPERATION_writeToTxtFile(data) {
		fs.writeFileSync("../assets/output/output.txt", data);
	}

	async OPERATION_getFiveProducts(selector) {
		let result = await this.page.$$eval(selector);
	}

	async getScreenShot_clip(selector) {
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
	async getTextContent_one(selector) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPERATION_getTextContent_one(selector))
			.then((result) => console.log(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async getProductInfo(selector_parent, selector_child1) {
		//
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			// .then(() => this.OPPERATION_getScreenShot_fullpage())
			.then(() =>
				this.OPERATION_getProductInfo(selector_parent, selector_child1)
			)
			.then((result) => console.log(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async opperation_2(input) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => console.log(input))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
}

const searchInputs1 = {
	webSite: AMAZON,
	productName: "iPhone",
	min_price: 100,
	max_price: 400,
	condition: "New",
};

const search1 = new Search(searchInputs1);
// search1.printURL(amazonSelector2);
// search1.getScreenShot_fullpage();
search1.getProductInfo(amazonSelector3, amazonSelector4);
// search1.getTextContent_one(amazonSelector2);
