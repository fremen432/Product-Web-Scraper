import { Inputs } from "../utilities/interfaces"

const ebay_URL1 = `
https://www.ebay.com/sch/i.html?_
from=R40
&_trksid=p2334524.m570.l1313
&_nkw=iphone+between+%24100+and+%24200
&_sacat=0
&LH_TitleDesc=0
&_odkw=chair
&_osacat=0`

const ebay_URL2 = `
https://www.ebay.com/sch/i.html?_from=R40
&_trksid=p2334524.m570.l1313
&_nkw=iphone
&_sacat=0
&LH_TitleDesc=0
&_odkw=iphone+between+%24100+and+%24200
&_osacat=0
`

const ebay_URL3 = `
https://www.ebay.com/sch/i.html?_from=R40
&_nkw=iphone&_sacat=0
&LH_TitleDesc=0
&rt=nc
&_udlo=100
&_udhi=200
`

// with price range min = $100 max = $200
const ebay_URL4 = `
https://www.ebay.com/sch/i.html?_from=R40
&_trksid=p2334524.m570.l1313
&_nkw=samsung+smartphone&_sacat=0
&LH_TitleDesc=0
&_udlo=100
&rt=nc
&_odkw=iphone
&_osacat=0
&_udhi=200`

// with price range min = $100 max = $200 and condition "New"
const ebay_URL5 = `
https://www.ebay.com/sch/i.html?_from=R40
&_trksid=p2334524.m570.l1313
&_nkw=samsung+smartphone
&_sacat=0
&LH_TitleDesc=0
&_udlo=100
&rt=nc
&_odkw=samsung+smartphone
&_osacat=0
&LH_ItemCondition=1000
&_udhi=200`

// with price range min = $100 max = $200 and condition "Used"
const ebay_URL6 = `
https://www.ebay.com/sch/i.html?_from=R40
&_trksid=p2334524.m570.l1313
&_nkw=samsung+smartphone
&_sacat=0
&LH_TitleDesc=0
&_udlo=100
&_udhi=200
&rt=nc
&_odkw=samsung+smartphone
&_osacat=0
&LH_ItemCondition=3000
`

// search for 'blender between $75 and $100' with condition = referbished
const walmartURL3 = `
https://www.walmart.com/search?
q=blender+between+%2475+and+%24100
&facet=condition%3ARefurbished
`;
const walmartURL4 = `
https://www.walmart.com/search?
q=blender+between+%2475+and+%24100
&facet=condition%3ARefurbished%7C%7Ccondition%3ANew
`;

const walmartURL5 = `https://www.walmart.com/search?
q=bike
&max_price=637
&min_price=105`

// iphone between $100 - $200 (signed in)
const amazonURL = `https://www.amazon.com/s?
k=iphone
&rh=p_36%3A10000-20000
&crid=2HRCFSJUY8X84
&qid=1656051814&rnid=14674871011
&sprefix=iphone%2Caps%2C264
&ref=sr_nr_p_36_7`

// iphone 13 between $400 - $500 (not signed in)
const amazonURL2 = `https://www.amazon.com/s?
k=iphone+13
&rh=p_36%3A40000-50000
&crid=39OLUXE5KB9OF
&qid=1656052025
&rnid=14674871011
&sprefix=iphone+13
%2Caps%2C142
&ref=sr_nr_p_36_7`

const amazonBaseURL3 = `https://www.amazon.com/s?
k=iphone+13
&rh=p_36%3A30000-60000
&crid=3TK51KOFAY9GX
&qid=1656052320
&rnid=14674871011
&sprefix=iphone+13
%2Caps%2C131
&ref=sr_nr_p_36_7
`

const amazonURL_selfMade1 = `
https://www.amazon.com/s?
k=Samsung+Galaxy+Smartphone
&rh=p_36%3A-
&rh=p_36%3A30000-40000


&crid=39OLUXE5KB9OF
&qid=1656052025
&rnid=14674871011
&sprefix=iphone+13
%2Caps%2C142
&ref=sr_nr_p_36_7`

const amazonOnlyMinPrice = `https://www.amazon.com/s?k=Samsung+Galaxy+Smartphone
&rh=p_36%3A50000-
&crid=WP6X0T7W78MX&qid=1656052713&rnid=14674871011&sprefix=samsung+galaxy+smartphone%2Caps%2C359&ref=sr_nr_p_36_7`

const ebayscratch = `https://www.ebay.com/sch/i.html?
_from=R40
&_trksid=p2334524.m570.l1313
&_nkw=${input.productName}
&_udlo=${input.min_price}
&_udhi=${input.max_price}`

const ebayscratch2 = `https://www.ebay.com/sch/i.html?
&_nkw=iPhone
&_udlo=400
&_udhi=600`


const conditions = {
    Cragslist: {
        "new": 10,
        "like new": 9,
        "excellent": 8,
        "good": 7,
        "fair": 6,
        "salvage": 5,
    },
    eBay: {
        "New": 10,
        "Open box": 10,
        "Used": 10,
        "For parts or not working": 10,
        "Not Specific": 10,
    }
}

const NEW = "NEW"

const inputs1: Inputs = {
    webSite: "AMAZON",
    productName: 'iPhone',
    min_price: 100,
    max_price: 200,
    condition: NEW
}

const test = (inputs: Inputs) => { 
    switch (inputs.webSite) {
        case 'AMAZON':
            {
                let message = 'Hey this is an awesome AMAZON message'
                return message
            }
            break;
    
        default:
            break;
    }
}

let res = test(inputs1)
console.log(res)

export {}