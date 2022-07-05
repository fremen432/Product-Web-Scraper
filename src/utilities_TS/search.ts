import { Search, AmazonSearch, EbaySearch, CraigslistSearch, TargetSearch, WalmartSearch } from "./classes.js";
import { Inputs } from "./interfaces.js";

const consolidateSearches = async (searchQueries: Inputs) => {
	const search_Amazon = new AmazonSearch(searchQueries);
	const search_Ebay = new EbaySearch(searchQueries);
	const search_Craigslist = new CraigslistSearch(searchQueries);
	const search_Target = new TargetSearch(searchQueries);
	const search_Walmart = new WalmartSearch(searchQueries);

	const results_Amazon = await search_Amazon.getProductInfo();
	// const results_Ebay = await search_Ebay.getProductInfo();
	// const results_Target = await search_Target.getProductInfo();

	// const results_Craigslist = await search_Craigslist.getProductInfo();

	// const results_Target = await search_Target.getScreenShot_fullpage();
	// const url_Target = await search_Target.printURL();

	// const results_Walmart = await search_Walmart.getScreenShot_fullpage();
	// const url_Walmart = search_Walmart.printURL();

	return {
		AmazonResults: results_Amazon,
		// EbayResults: results_Ebay,
		// TargetResults: results_Target,
		// CraigslistResults: results_Craigslist,
		// WalmartResults: results_Walmart,
	};
};

const searchInputs1 = {
	// webSite: AMAZON,
	productName: "ps5 controller",
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
