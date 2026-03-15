const pool = require("../db/db");

async function generateRID(){

const year = new Date().getFullYear();

const result = await pool.query("SELECT COUNT(*) FROM identifiers");

const number = parseInt(result.rows[0].count)+1;

return `RID-${year}-${String(number).padStart(5,"0")}`;
}

async function generateAID(){

const year = new Date().getFullYear();

const result = await pool.query("SELECT COUNT(*) FROM authors");

const number = parseInt(result.rows[0].count)+1;

return `AID-${year}-${String(number).padStart(5,"0")}`;
}

async function generateDID(){

const year = new Date().getFullYear();

const result = await pool.query("SELECT COUNT(*) FROM datasets");

const number = parseInt(result.rows[0].count)+1;

return `DID-${year}-${String(number).padStart(5,"0")}`;
}

module.exports = {generateRID,generateAID,generateDID};
