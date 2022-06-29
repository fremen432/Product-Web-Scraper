import puppeteer from "puppeteer";
import * as fs from "fs";

// import { AMAZON, EBAY, WALMART, CRAIGSLIST, TARGET } from "./constants.js";
import {
	Search,
	AmazonSearch,
	EbaySearch,
	CraigslistSearch,
	TargetSearch,
	WalmartSearch,
} from "./classes.js";

const consolidateSearches = async (searchQueries) => {
	// const search_Amazon = new Search(searchQueries);

	const search_Amazon = new AmazonSearch(searchQueries);
	const search_Ebay = new EbaySearch(searchQueries);
	const search_Craigslist = new CraigslistSearch(searchQueries);
	const search_Target = new TargetSearch(searchQueries);
	const search_Walmart = new WalmartSearch(searchQueries);

	const results_Amazon = await search_Amazon.getProductInfo();
	// const results_Amazon = await search_Amazon.getScreenShot_fullpage();
	// const results_Amazon = search_Amazon.printURL();

	// const results_Ebay = search_Ebay.printURL();
	// const results_Ebay = await search_Ebay.getProductInfo();
	// console.log(search_Ebay.min_price);

	// return results_Amazon;
	return {
		AmazonResults: results_Amazon,
		// EbayResults: results_Ebay,
		// CraigslistResults: searchResults_Craigslist,
		// TargetResults: searchResults_Target,
		// WalmartResults: searchResults_Walmart,
	};
};

const searchInputs1 = {
	// webSite: AMAZON,
	productName: "iphone",
	min_price: "500",
	max_price: "",
	condition: "New",

	/* 
		Might want to add:
			amazon prime available
			number of ratings
	*/
};

const allResults = await consolidateSearches(searchInputs1);
console.log(allResults);
