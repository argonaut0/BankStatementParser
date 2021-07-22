const fs = require('fs');
const pdf = require('pdf-parse');

const { folder } = require('./env');

const statements = fs.readdirSync(folder);
console.log("Found statements:");
console.log(statements);

const contents = statements.map(
    (x) => {
        return fs.readFileSync(folder + x);
    }
);

const MONTHS = String.raw`(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)`;
const DATE = MONTHS + String.raw`\s+\d\d`;
const DATES = DATE + String.raw`\s+` + DATE;
const TITLE = "^" + DATES + String.raw`.*\n`;
const TID = String.raw`\d{23}\n`;
const AMOUNT = String.raw`-?\$\d+.\d\d$`;
const TRANSACTION = TITLE + TID + AMOUNT;

const parsed = Promise.all(contents.map(
    (x) => pdf(x)
));

parsed.then(
    (x) => {
        console.log(x.map((data)=>data.text.match(new RegExp(TRANSACTION, "gm"))).reduce((x, y) => x.concat(y), []).map((x)=>x.split(/\n/)));
    }
);


/*
pdf(dataBuffer).then(function(data) {
 
    // number of pages
    console.log(data.numpages);
    // number of rendered pages
    console.log(data.numrender);
    // PDF info
    console.log(data.info);
    // PDF metadata
    console.log(data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text
    console.log(data.text); 
        
});
*/
