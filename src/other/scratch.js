"use strict";
exports.__esModule = true;
var ebay_URL1 =
	"\nhttps://www.ebay.com/sch/i.html?_\nfrom=R40\n&_trksid=p2334524.m570.l1313\n&_nkw=iphone+between+%24100+and+%24200\n&_sacat=0\n&LH_TitleDesc=0\n&_odkw=chair\n&_osacat=0";
var ebay_URL2 =
	"\nhttps://www.ebay.com/sch/i.html?_from=R40\n&_trksid=p2334524.m570.l1313\n&_nkw=iphone\n&_sacat=0\n&LH_TitleDesc=0\n&_odkw=iphone+between+%24100+and+%24200\n&_osacat=0\n";
var ebay_URL3 =
	"\nhttps://www.ebay.com/sch/i.html?_from=R40\n&_nkw=iphone&_sacat=0\n&LH_TitleDesc=0\n&rt=nc\n&_udlo=100\n&_udhi=200\n";
// with price range min = $100 max = $200
var ebay_URL4 =
	"\nhttps://www.ebay.com/sch/i.html?_from=R40\n&_trksid=p2334524.m570.l1313\n&_nkw=samsung+smartphone&_sacat=0\n&LH_TitleDesc=0\n&_udlo=100\n&rt=nc\n&_odkw=iphone\n&_osacat=0\n&_udhi=200";
// with price range min = $100 max = $200 and condition "New"
var ebay_URL5 =
	"\nhttps://www.ebay.com/sch/i.html?_from=R40\n&_trksid=p2334524.m570.l1313\n&_nkw=samsung+smartphone\n&_sacat=0\n&LH_TitleDesc=0\n&_udlo=100\n&rt=nc\n&_odkw=samsung+smartphone\n&_osacat=0\n&LH_ItemCondition=1000\n&_udhi=200";
// with price range min = $100 max = $200 and condition "Used"
var ebay_URL6 =
	"\nhttps://www.ebay.com/sch/i.html?_from=R40\n&_trksid=p2334524.m570.l1313\n&_nkw=samsung+smartphone\n&_sacat=0\n&LH_TitleDesc=0\n&_udlo=100\n&rt=nc\n&_odkw=samsung+smartphone\n&_osacat=0\n&LH_ItemCondition=3000\n&_udhi=200";
// search for 'blender between $75 and $100' with condition = referbished
var walmartURL3 =
	"\nhttps://www.walmart.com/search?\nq=blender+between+%2475+and+%24100\n&facet=condition%3ARefurbished\n";
var walmartURL4 =
	"\nhttps://www.walmart.com/search?\nq=blender+between+%2475+and+%24100\n&facet=condition%3ARefurbished%7C%7Ccondition%3ANew\n";
var NEW = "NEW";
var inputs1 = {
	webSite: "AMAZON",
	productName: "iPhone",
	min_price: 100,
	max_price: 200,
	condition: NEW,
};
var test = function (inputs) {
	switch (inputs.webSite) {
		case "AMAZON":
			var message = "Hey this is an awesome AMAZON message";
			{
			}
			return message;
			break;
		default:
			break;
	}
};
var res = test(inputs1);
console.log(res);
