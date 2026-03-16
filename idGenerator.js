const pool = require("../config/db");

async function generateIdentifier(type){

let prefix = "10.1001";
let code = "";

if(type === "author") code = "AUTH";
if(type === "dataset") code = "DATA";
if(type === "paper") code = "PAPR";

const result = await pool.query(
`SELECT number FROM identifiers
WHERE type=$1
ORDER BY number DESC
LIMIT 1`,
[type]
);

let nextNumber = 1;

if(result.rows.length > 0){
nextNumber = result.rows[0].number + 1;
}

let numberStr = String(nextNumber).padStart(5,"0");

let identifier = `${prefix}/${code}${numberStr}`;

return {
identifier,
prefix,
number: nextNumber
};

}

module.exports = generateIdentifier;
