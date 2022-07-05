/* 
	What variables do we want in Search:
		this.productName_string = string;
		this.productName_url = string.replace(" ", "+");
		this.min_price = Number(inputs.min_price);
		this.max_price = Number(inputs.max_price);

	What methods do we want in Search:
		connect()
		disconnect()

		printThis()
		printProduct()

		OPPERATION_getScreenshot_Full()
		OPPERATION_getScreenshot_Clip()

	What variables are specific to each extended Search class:
		this.website = [specific website]
		this.fullURL 
	
	What methods are specific to each extended Search class:
		OPPERATION_getProductInfo()

*/
import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";

// const puppeteerExtra = require("puppeteer-extra");
// const pluginStealth = require("puppeteer-extra-plugin-stealth");
import puppeteerExtra from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import * as fs from "fs";

import { AMAZON, EBAY, WALMART, CRAIGSLIST, TARGET } from "./constants";
import { Coordinates, Inputs } from "./interfaces";

export class Search {
	// puppeteer
	browser: any;
	page: any;
	srcTxt: string = "";

	productName: string = "";
	productName_string: string = "";
	productName_url: string = "";
	fullURL: string = "";
	min_price: string = "";
	max_price: string = "";

	webSite: string = "";
	firstParagraph: string = "";

	constructor(inputs: Inputs) {
		const thisProductName = inputs.productName;

		this.productName_string = thisProductName;
		this.productName_url = thisProductName.split(" ").join("+");
		this.min_price = inputs.min_price;
		this.max_price = inputs.max_price;
	}
	// async connect_stealth() {
	// 	// -- PUPPETEER STEALTH LAUNCH --
	// 	puppeteerExtra.use(pluginStealth());
	// 	this.browser = await puppeteerExtra
	// 		.use(pluginStealth())
	// 		.launch({ headless: false });

	// 	this.page = await this.browser.newPage();
	// 	await this.page.goto(this.fullURL);

	// 	await this.page.goto(this.fullURL, {
	// 		waitUntil: "networkidle0",
	// 	});
	// 	console.log("-- CONNECTED --");

	// 	// Scroll to the very top of the page
	// 	await this.page.evaluate((_) => {
	// 		window.scrollTo(0, 0);
	// 	});

	// 	// Scroll to the bottom of the page with puppeteer-autoscroll-down
	// 	await scrollPageToBottom(this.page);
	// 	console.log("scrolled to bottom");
	// }
	async connect() {
		this.browser = await puppeteer.launch();
		this.page = await this.browser.newPage();
		await this.page.goto(this.fullURL, {
			waitUntil: "networkidle0",
		});
		console.log("-- CONNECTED --");

		// Scroll to the very top of the page
		await this.page.evaluate((_: any) => {
			window.scrollTo(0, 0);
		});

		// Scroll to the bottom of the page with puppeteer-autoscroll-down
		await scrollPageToBottom(this.page, {});
		console.log("scrolled to bottom");
	}
	disConnect = () => {
		this.browser.close();
		console.log("-- DISCONNECTED --");
	};
	printThis = () => console.log(this);
	printURL = () => console.log(this.fullURL);
	printProduct = () => console.log(this.productName);

	async OPPERATION_getCoordinates(thisSelector: string) {
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
			path: `../assets/screenshots/fullpage/screenshot${Date.now()}.png`,
			fullPage: true,
		});
	}
	async OPERATION_getTextContent_one(selector: string) {
		return await this.page.$eval(selector, (el: any) => JSON.stringify(el.textContent));
	}

	async getScreenShot_clip(selector: string) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPPERATION_getCoordinates(selector))
			.then((result) => this.OPPERATION_getScreenShot_clip(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
	async getScreenShot_fullpage() {
		this.connect()
			.then(() => this.OPPERATION_getScreenShot_fullpage())
			.then(() => this.disConnect());
	}
	async getTextContent_one(selector: string) {
		this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPERATION_getTextContent_one(selector))
			.then((result) => console.log(result))
			.then(() => this.disConnect())
			.then(() => console.log("-- DONE --"));
	}
}

export class AmazonSearch extends Search {
	condition: string | undefined;
	constructor(inputs: Inputs) {
		super(inputs);
		this.webSite = AMAZON;
		const findCondition = (input: string) => {
			switch (input) {
				case "New":
					return "New";
				case "Certified Refurbished":
					return "Certified+Refurbished";
				case "Used":
					return "Used";
				default:
					"";
			}
		};
		this.condition = findCondition(inputs.condition);

		const min_price_string = this.min_price && `${this.min_price}00`;
		const max_price_string = this.max_price && `${this.max_price}00`;
		const priceRange = `p_36%3A${min_price_string}-${max_price_string}%2c`;
		const condition = `p_n_condition-type%3A${this.condition}&dc`;

		this.fullURL = `https://www.amazon.com/s?k=${this.productName_url}&rh=${priceRange}${this.condition ? condition : ""}`;
	}
	async OPERATION_getProductInfo() {
		return await this.page.evaluate(() => {
			const resultArray: any[] = [];
			const selector_productWrapper = "div.s-main-slot.s-result-list.s-search-results.sg-row > div > div > div > div > div > div";
			const selector_price = "a > span > span.a-offscreen";
			const selector_productName = "h2 > a.s-link-style > span";
			const selector_stars = "a > i.a-icon-star-small > span";
			const selector_link = "div > span > a.a-link-normal.s-no-outline";
			const selector_primeShipping = "span.aok-relative.s-icon-text-medium.s-prime > i.a-icon-prime";
			const selector_reviewCount = "span > a.a-link-normal.s-underline-text.s-link-style > span.a-size-base.s-underline-text";
			const selector_productImage = "div.s-product-image-container.aok-relative.s-image-overlay-grey.s-text-center.s-padding-left-small.s-padding-right-small.s-flex-expand-height > div > span > a > div > img.s-image";

			Array.from(document.querySelectorAll(selector_productWrapper)).forEach((el) => {
				// el initially has type 'Element' but needs to be casted to type 'HTMLElement' in order to get the textcontent, src, href... properties
				const element_productName = el.querySelector(selector_productName) as HTMLElement;
				const element_price = el.querySelector(selector_price) as HTMLSpanElement;
				const element_productImage = el.querySelector(selector_productImage) as HTMLImageElement;
				const element_primeShipping = el.querySelector(selector_primeShipping) as HTMLElement;
				const element_stars = el.querySelector(selector_stars) as HTMLElement;
				const element_link = el.querySelector(selector_link) as HTMLAnchorElement;
				const element_reviewCount = el.querySelector(selector_reviewCount) as HTMLElement;

				const info_productName = element_productName ? element_productName.textContent : "No product name found";
				const info_price = element_price ? element_price.innerText : "No price found";
				const info_productImage = element_productImage ? element_productImage.src : "No product image found";
				const info_primeShipping = element_primeShipping ? true : false;
				const info_stars = element_stars ? element_stars.textContent : "No star rating found";
				const info_link = element_link ? element_link.href : "No link found";
				const info_reviewCount = element_reviewCount ? element_reviewCount.innerText : "No review count found";

				resultArray.push({
					ProductName: info_productName,
					Price: info_price,
					StarRating: info_stars,
					ReviewCount: info_reviewCount,
					ProductLink: info_link,
					PrimeShipping: info_primeShipping,
					ProductImage: info_productImage,
				});
			});
			// filters out the first couple list items results that aren't actual products
			return resultArray.filter((el) => el.ProductName != "No product name Found");
		});
	}
	async getProductInfo() {
		return this.connect()
			.then(() => this.OPERATION_getProductInfo())
			.then((result) => {
				this.disConnect();
				console.log("AMAZON SEARCH DONE ✅");
				return result.filter((value: any, i: number) => i <= 4);
			});
	}
}
export class EbaySearch extends Search {
	condition: string | undefined;
	constructor(inputs: Inputs) {
		super(inputs);
		this.webSite = EBAY;
		const findCondition = (input: string) => {
			switch (input) {
				case "New":
					return "1000";
				case "Open Box":
					return "1500";
				case "Used":
					return "3000";
				case "Seller Refurbished":
					return "2500";
				default:
					"";
			}
		};
		this.condition = findCondition(inputs.condition);
		this.fullURL = `https://www.ebay.com/sch/i.html?&_nkw=${this.productName_url}&_udlo=${this.min_price}&_udhi=${this.max_price}&LH_ItemCondition=${this.condition}`;
	}
	async OPERATION_getProductInfo() {
		return await this.page.evaluate(() => {
			const resultArray: any[] = [];

			const selector_productWrapper = "#srp-river-results > ul.srp-results > li.s-item";

			const selector_price = "div.s-item__detail > span.s-item__price";
			const selector_productName = "div.s-item__info.clearfix > a > h3.s-item__title";
			const selector_stars = "a > div.x-star-rating > span.clipped";
			const selector_link = "div.s-item__info > a.s-item__link";
			const selector_shipping = "div.s-item__info.clearfix > div.s-item__details.clearfix > div.s-item__detail > span.s-item__shipping";
			const selector_reviewCount = "div.s-item__reviews > a > span.s-item__reviews-count > span";
			const selector_productImage = "div.s-item__image-section > div > a > div > img";

			Array.from(document.querySelectorAll(selector_productWrapper)).forEach((el) => {
				const element_productName = el.querySelector(selector_productName) as HTMLElement;
				const element_price = el.querySelector(selector_price) as HTMLSpanElement;
				const element_productImage = el.querySelector(selector_productImage) as HTMLImageElement;
				const element_shipping = el.querySelector(selector_shipping) as HTMLElement;
				const element_stars = el.querySelector(selector_stars) as HTMLElement;
				const element_link = el.querySelector(selector_link) as HTMLAnchorElement;
				const element_reviewCount = el.querySelector(selector_reviewCount) as HTMLElement;

				const info_productName = element_productName ? element_productName.textContent : "No product name found";
				const info_price = element_price ? element_price.innerText : "No price found";
				const info_productImage = element_productImage ? element_productImage.src : "No product image found";
				const info_shipping = element_shipping ? element_shipping.textContent : "No shipping information found";
				const info_stars = element_stars ? element_stars.textContent : "No star rating found";
				const info_link = element_link ? element_link.href : "No link found";
				const info_reviewCount = element_reviewCount ? element_reviewCount.innerText : "No review count found";

				resultArray.push({
					ProductName: info_productName,
					Price: info_price,
					StarRating: info_stars,
					ReviewCount: info_reviewCount,
					ShippingCost: info_shipping,
					ProductLink: info_link,
					ProductImage: info_productImage,
				});
			});

			return resultArray;
		});
	}
	async getProductInfo() {
		return this.connect()
			.then(() => this.OPERATION_getProductInfo())
			.then((result) => {
				this.disConnect();
				console.log("EBAY SEARCH DONE ✅");
				return result.filter((value: any, i: number) => i <= 4);
			});
	}
}
export class CraigslistSearch extends Search {
	condition: string | undefined;
	constructor(inputs: Inputs) {
		super(inputs);
		this.webSite = CRAIGSLIST;
		const findCondition = (input: string) => {
			switch (input) {
				case "New":
					return "1000";
				case "Open Box":
					return "1500";
				case "Used":
					return "3000";
				case "Seller Refurbished":
					return "2500";
				default:
					"";
			}
		};

		/* 
		`https://austin.craigslist.org/search/sss?query=${this.productName_url}&min_price=${this.min_price}&max_price=${this.max_price}`;

		*/
		this.condition = findCondition(inputs.condition);
		this.fullURL = `https://austin.craigslist.org/search/sss?query=${this.productName_url}
		${this.min_price && "&min_price=" + this.min_price}
		${this.max_price && "&max_price=" + this.max_price}
		`;
		// ${this.min_price && `&min_price=${this.min_price}`}
		// ${this.max_price && `&max_price=${this.max_price}`}
	}
	async OPERATION_getProductInfo() {
		return await this.page.evaluate(() => {
			const resultArray: any[] = [];

			const selector_productWrapper = "#search-results > li";

			const selector_price = "div > span.result-meta > span.result-price";
			const selector_productName = "h3.result-heading > a.result-title";
			const selector_link = "div.s-item__info > a.s-item__link";
			const selector_shipping = "div.s-item__info.clearfix > div.s-item__details.clearfix > div.s-item__detail > span.s-item__shipping";
			const selector_reviewCount = "div.s-item__reviews > a > span.s-item__reviews-count > span";

			Array.from(document.querySelectorAll(selector_productWrapper)).forEach((el) => {
				const element_productName = el.querySelector(selector_productName) as HTMLElement;
				const element_price = el.querySelector(selector_price) as HTMLElement;
				const element_shipping = el.querySelector(selector_shipping) as HTMLElement;
				const element_link = el.querySelector(selector_link) as HTMLAnchorElement;
				const element_reviewCount = el.querySelector(selector_reviewCount) as HTMLElement;

				const info_productName = element_productName ? element_productName.textContent : "No product name found";
				const info_price = element_price ? element_price.innerText : "No price found";
				const info_shipping = element_shipping ? element_shipping.textContent : "No shipping information found";
				const info_link = element_link ? element_link.href : "No link found";
				const info_reviewCount = element_reviewCount ? element_reviewCount.innerText : "No review count found";

				resultArray.push({
					ProductName: info_productName,
					Price: info_price,
					ReviewCount: info_reviewCount,
					ShippingCost: info_shipping,
					ProductLink: info_link,
				});
			});

			return resultArray;
		});
	}
	async getProductInfo() {
		return this.connect()
			.then(() => console.log("-- CONNECTED --"))
			.then(() => this.OPERATION_getProductInfo())
			.then((result) => {
				this.disConnect();
				console.log("-- CRAIGSLIST SEARCH DONE --");
				return result.filter((value: any, i: number) => i <= 4);
			});
	}
}
export class TargetSearch extends Search {
	condition: string | undefined;
	constructor(inputs: Inputs) {
		super(inputs);
		this.webSite = TARGET;
		const findCondition = (input: string) => {
			switch (input) {
				case "New":
					return "1000";
				case "Open Box":
					return "1500";
				case "Used":
					return "3000";
				case "Seller Refurbished":
					return "2500";
				default:
					"";
			}
		};
		this.condition = findCondition(inputs.condition);
		this.fullURL = `https://www.target.com/s?searchTerm=${this.productName_url}
		${this.min_price && "&minPrice=" + this.min_price}
		${this.max_price && "&maxPrice=" + this.max_price}
		`;
		// ${this.min_price ? `&minPrice=${this.min_price}` : ""}
		// ${this.max_price ? `&maxPrice=${this.max_price}` : ""}
	}
	async OPERATION_getProductInfo() {
		return await this.page.evaluate(() => {
			const resultArray: any[] = [];
			const selector_productWrapper = "#pageBodyContainer > div:nth-child(1) > div > div:nth-child(4) > div > div.styles__StyledRow-sc-1nuqtm0-0.goXowJ > div.styles__StyledCol-sc-ct8kx6-0.kakpde > div > section > div > div";

			const selector_productName = "div.styles__ProductCardItemInfoDiv-sc-h3r0um-0.cWxnyu > div.h-display-flex > a";
			const selector_price = "div.styles__ProductCardPriceAndPromoStyled-sc-1p9w55v-0.bqCwoU > div > div.h-padding-r-tiny > div > span";
			const selector_stars = "div.styles__ProductCardItemInfoDiv-sc-h3r0um-0.cWxnyu > a > div > span.RatingStars__StyledRatingStars-sc-1wivxuc-0.kkacuW > span";
			const selector_reviewCount = "div.styles__ProductCardItemInfoDiv-sc-h3r0um-0.cWxnyu > a > div > span.RatingStars__RatingCount-sc-1wivxuc-1.kmknnG";
			const selector_shipping = "";
			const selector_link = "div.ProductCardImageWrapper-sc-5fgvkn-0.styles__StyledProductCardImageWrapper-sc-bcz5ql-1.hkdLjK.hknwO > h3 > div > div > a";
			const selector_productImage = "";

			const element_productWrapper = document.querySelectorAll(selector_productWrapper);

			if (!element_productWrapper) return "product wrapper element was not selected";

			Array.from(element_productWrapper).forEach((el) => {
				const element_productName = el.querySelector(selector_productName) as HTMLElement;
				const element_price = el.querySelector(selector_price) as HTMLSpanElement;
				const element_productImage = el.querySelector(selector_productImage) as HTMLImageElement;
				const element_shipping = el.querySelector(selector_shipping) as HTMLElement;
				const element_stars = el.querySelector(selector_stars) as HTMLElement;
				const element_link = el.querySelector(selector_link) as HTMLAnchorElement;
				const element_reviewCount = el.querySelector(selector_reviewCount) as HTMLElement;

				const info_productName = element_productName ? element_productName.textContent : "No product name found";
				const info_price = element_price ? element_price.innerText : "No price found";
				const info_productImage = element_productImage ? element_productImage.src : "No product image found";
				const info_shipping = element_shipping ? element_shipping.textContent : "No shipping information found";
				const info_stars = element_stars ? element_stars.textContent : "No star rating found";
				const info_link = element_link ? element_link.href : "No link found";
				const info_reviewCount = element_reviewCount ? element_reviewCount.innerText : "No review count found";

				resultArray.push({
					ProductName: info_productName,
					Price: info_price,
					StarRating: info_stars,
					ReviewCount: info_reviewCount,
					ShippingCost: info_shipping,
					ProductLink: info_link,
					ProductImage: info_productImage,
				});
				return resultArray;
			});
		});
	}
	async getProductInfo() {
		return this.connect()
			.then(() => this.OPERATION_getProductInfo())
			.then((result) => {
				this.disConnect();
				console.log("TARGET SEARCH DONE ✅");
				return result.filter((value: any, i: number) => i <= 4);
			});
	}
}
export class WalmartSearch extends Search {
	condition: string | undefined;
	constructor(inputs: Inputs) {
		super(inputs);
		this.webSite = WALMART;
		let product = this.productName_string;
		this.productName_url = product.split(" ").join("+");
		const findCondition = (input: string) => {
			switch (input) {
				case "New":
					return "New";
				case "Certified Refurbished":
					return "Certified+Refurbished";
				case "Used":
					return "Used";
				default:
					"";
			}
		};
		this.condition = findCondition(inputs.condition);

		// const priceRange = `p_36%3A${min_price_string}-${max_price_string}%2c`;
		// const condition = `p_n_condition-type%3A${this.condition}&dc`;

		this.fullURL = `https://www.walmart.com/
		search?q=${this.productName_url}
		${this.min_price && "&min_price=" + this.min_price}
		${this.max_price && "&max_price=" + this.max_price}
		`;
		// ${this.min_price && `&min_price=${this.min_price}`}
		// ${this.max_price && `&max_price=${this.max_price}`}
	}
	async OPERATION_getProductInfo() {
		return await this.page.evaluate(() => {
			const resultArray: any[] = [];
			const selector_productWrapper = "section > div > div.mb1.ph1.pa0-xl.bb.b--near-white.w-33";

			const selector_productName = "h2 > a.s-link-style > span";
			const selector_price = "div.flex.flex-wrap.justify-start.items-center.lh-title.mb2.mb1-m > div.b.f5.f4-l.black.mr1.lh-copy";
			const selector_stars = "a > i.a-icon-star-small > span";
			const selector_reviewCount = "span > a.a-link-normal.s-underline-text.s-link-style > span.a-size-base.s-underline-text";
			const selector_shipping = "span.aok-relative.s-icon-text-medium.s-prime > i.a-icon-prime";
			const selector_link = "div > span > a.a-link-normal.s-no-outline";
			const selector_productImage = "";

			const element_productWrapper = document.querySelectorAll(selector_productWrapper);

			if (!element_productWrapper) return "product wrapper element was not selected";

			Array.from(element_productWrapper).forEach((el) => {
				const element_productName = el.querySelector(selector_productName) as HTMLElement;
				const element_price = el.querySelector(selector_price) as HTMLSpanElement;
				const element_productImage = el.querySelector(selector_productImage) as HTMLImageElement;
				const element_shipping = el.querySelector(selector_shipping) as HTMLElement;
				const element_stars = el.querySelector(selector_stars) as HTMLElement;
				const element_link = el.querySelector(selector_link) as HTMLAnchorElement;
				const element_reviewCount = el.querySelector(selector_reviewCount) as HTMLElement;

				const info_productName = element_productName ? element_productName.textContent : "No product name found";
				const info_price = element_price ? element_price.innerText : "No price found";
				const info_productImage = element_productImage ? element_productImage.src : "No product image found";
				const info_shipping = element_shipping ? element_shipping.textContent : "No shipping information found";
				const info_stars = element_stars ? element_stars.textContent : "No star rating found";
				const info_link = element_link ? element_link.href : "No link found";
				const info_reviewCount = element_reviewCount ? element_reviewCount.innerText : "No review count found";

				resultArray.push({
					ProductName: info_productName,
					Price: info_price,
					StarRating: info_stars,
					ReviewCount: info_reviewCount,
					ShippingCost: info_shipping,
					ProductLink: info_link,
					ProductImage: info_productImage,
				});
				return resultArray;
			});
		});
	}
	async getProductInfo() {
		return this.connect()
			.then(() => this.OPERATION_getProductInfo())
			.then((result) => {
				this.disConnect();
				return result.filter((value: any, i: number) => i <= 4);
			});
	}
}
