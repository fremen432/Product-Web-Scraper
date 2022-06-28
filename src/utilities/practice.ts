import puppeteer from 'puppeteer'
import { Search } from './search';

import { AMAZON, EBAY, WALMART, CRAIGSLIST, TARGET } from './constants';

interface Inputs {
    webSite: String,
    productName: String,
    min_price: Number,
    max_price: Number,
    condition: Number
}

const inputs1 = {
    webSite: AMAZON,
    productName: 'iPhone',
    min_price: 100,
    max_price: 200,
    condition: 1
}

// const search1 = new Search(inputs1)

const search_term = `${inputs1.productName}+between+$${inputs1.min_price}+and+$${inputs1.max_price}`

const amazonURL = `https://www.amazon.com/s?k=${search_term}`;



export {}