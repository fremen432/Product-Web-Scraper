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

	// const results_Amazon = await search_Amazon.getProductInfo();
	// const results_Ebay = await search_Ebay.getProductInfo();

	const results_Craigslist = await search_Craigslist.getProductInfo();
	// const results_Target = await results_Target.getProductInfo();
	// const results_Walmart = await search_Walmart.getProductInfo();

	return {
		// AmazonResults: results_Amazon,
		// EbayResults: results_Ebay,
		CraigslistResults: results_Craigslist,
		// TargetResults: results_Target,
		// WalmartResults: results_Walmart,
	};
};

const searchInputs1 = {
	// webSite: AMAZON,
	productName: "apple imac",
	min_price: "",
	max_price: "",
	condition: "New",

	/* 
		Might want to add:
			amazon prime available
			number of ratings
			choose name brand
	*/
};

const allResults = await consolidateSearches(searchInputs1);
console.log(allResults);
