class Store {
	constructor(input) {
		// let d = new Date();
		this.purpose = "To sell people stuff";
		this.age = new Date().getFullYear() - input.dateEstablished;
	}
	sayHey = () => console.log("hey");
}

class Target extends Store {
	constructor(input) {
		super(input);
		this.material = "Birck and Mortor";
	}
	sayPhrase = () => console.log(`Hey I'm TARGET`);
}
class Amazon extends Store {
	constructor(input) {
		super(input);
		this.material = "Digital";
	}
	sayPhrase = () => console.log(`Hey I'm AMAZON`);
}

const newTarget = new Target({ dateEstablished: 1997 });
const newAmazon = new Amazon({ dateEstablished: 1997 });

// -- ANALYZING AMAZON PRICE RANGE AND CONDITION URL ARGUMENTS --

// condition: none | no price range
const amazonLink6 = `
https://www.amazon.com/
s?k=iphone
&crid=3TML4ZZLE2R89
&sprefix=iphone%2Caps%2C122
&ref=nb_sb_noss_1`;

// condition: new | range: $500 -
const amazonLink1 = `
https://www.amazon.com/
s?k=iphone
&rh=p_36%3A50000-
%2C
p_n_condition-type%3ANew
&dc
&ds=v1%3Auhn78W8o1hAbFQ%2BnS9sOeBP0jXxz8A2jZtMm9W5ApJs&qid=1656463313
&ref=sr_nr_p_n_condition-type_1`;

// condition: renewed | range: $300-$400
const amazonLink6 = `
https://www.amazon.com/
s?k=iphone
&rh=p_36%3A30000-40000
%2C
p_n_condition-type
%3A
Certified+Refurbished
&dc
&crid=3TML4ZZLE2R89&qid=1656464435
&sprefix=iphone%2Caps%2C122
&ref=sr_nr_p_n_condition-type_2
&ds=v1%3AKfnS3LKz0gT70XVdQOtX1RTV0kRxaZ4egmFARNgLC7k`;

const amazonLink7 = `https://www.amazon.com/
s?k=bike
&rh=p_36%3A10000-50000
&crid=T5MUZZ8GHB03&qid=1656555950&rnid=17784038011&sprefix=bike%2Caps%2C154&ref=sr_nr_p_36_6`;

// condition: new | no price range
const amazonLink3 = `
https://www.amazon.com/
s?k=iphone
&rh=
p_n_condition-type%3A
New
&dc
&crid=1VA0KSHFUPDKA&qid=1656463903
&sprefix=iphone%2Caps%2C108
&ref=sr_nr_p_n_condition-type_1
&ds=v1%3A4DOWZdKZt1YXSQvxifM4OxITAupeFaa%2Ffn%2F0nj3riQo`;
// condition: renewed | no price range
const amazonLink4 = `
https://www.amazon.com/
s?k=iphone
&rh=
p_n_condition-type%3A
Certified+Refurbished
&dc
&crid=1VA0KSHFUPDKA
&qid=1656463968
&sprefix=iphone%2Caps%2C108
&ref=sr_nr_p_n_condition-type_2
&ds=v1%3AzO6JUEGBKgnXAMvu8oOUb4Gr3O2haO%2F8d2lKomxKLvs`;
// condition: used | no price range
const amazonLink5 = `
https://www.amazon.com/
s?k=iphone
&rh=
p_n_condition-type%3A
Used
&dc
&crid=1VA0KSHFUPDKA
&qid=1656464265
&sprefix=iphone%2Caps%2C108
&ref=sr_nr_p_n_condition-type_3
&ds=v1%3A%2BShrGVWSzHZ8S7z%2BOWTcSm9KCIigzLrNn3XxuyJ2M6c`;
