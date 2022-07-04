/* 
    ipdata.co
    username:   cbm.signup@gmail.com
    pw:         wr6k3sk1vvddg461jche
    api key:    bd2b2bebfa8a28a8ee9a4b33cac3a494b45efab262f448fb70417f3d
    documentation:  https://docs.ipdata.co/docs/javascript
*/
import IPData from "ipdata";

const API_KEY = "bd2b2bebfa8a28a8ee9a4b33cac3a494b45efab262f448fb70417f3d";

// The library will cache 4096 ip addresses responses for 24 hours using a LRU cache by default. You can configure the cache by passing an object as the second paramenter.
const cacheConfig = {
	max: 1000, // max size
	maxAge: 10 * 60 * 1000, // max age in ms (i.e. 10 minutes)
};

// const ipdata = new IPData(API_KEY, cacheConfig);
// const ipdata = new IPData(API_KEY);

// ipdata.lookup().then((info) => console.log(info));

console.log(sum);
