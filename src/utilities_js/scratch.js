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
		const productName = el.querySelector(selector_productName).textContent;
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
console.log(resultArray);
