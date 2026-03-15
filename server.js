const express = require("express");

const apiRoutes = require("./routes/api");
const identifierRoutes = require("./routes/identifiers");
const authorRoutes = require("./routes/authors");
const datasetRoutes = require("./routes/datasets");

const layout = require("./views/layout");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

/* ---------- API ROUTES ---------- */

app.use("/api", apiRoutes);

/* ---------- WEB ROUTES ---------- */

app.use(identifierRoutes);
app.use(authorRoutes);
app.use(datasetRoutes);

/* ---------- HOME PAGE ---------- */

app.get("/", (req, res) => {

res.send(layout("Home",`

<h1>ResEdge ID Registry</h1>

<p>
A global research identifier infrastructure for
authors, research publications, and datasets.
</p>

<br>

<a href="/create"><button>Create Research ID</button></a>
<a href="/create-author"><button>Create Author</button></a>
<a href="/create-dataset"><button>Create Dataset</button></a>

<br><br>

<h3>Explore Registry</h3>

<a href="/browse"><button>Browse Identifiers</button></a>
<a href="/browse-authors"><button>Browse Authors</button></a>
<a href="/browse-datasets"><button>Browse Datasets</button></a>

`));

});

/* ---------- SEARCH PAGE ---------- */

app.get("/search",(req,res)=>{

res.send(layout("Search",`

<h2>Search Identifier</h2>

<form action="/resolve">

<input name="id" placeholder="Enter RID / AID / DID">

<button>Search</button>

</form>

`));

});

/* ---------- RESOLVER ---------- */

app.get("/resolve",(req,res)=>{

const id = req.query.id;

if(!id){
return res.send("Identifier missing");
}

if(id.startsWith("RID-")){
return res.redirect("/rid/"+id);
}

if(id.startsWith("AID-")){
return res.redirect("/author/"+id);
}

if(id.startsWith("DID-")){
return res.redirect("/dataset/"+id);
}

res.send("Identifier format not recognized");

});

/* ---------- DIRECT IDENTIFIER RESOLVER ---------- */

app.get("/:identifier", (req,res)=>{

const id = req.params.identifier;

if(id.startsWith("RID-")){
return res.redirect("/rid/"+id);
}

if(id.startsWith("AID-")){
return res.redirect("/author/"+id);
}

if(id.startsWith("DID-")){
return res.redirect("/dataset/"+id);
}

res.send("Identifier not recognized");

});

/* ---------- SERVER ---------- */

app.listen(PORT,()=>{

console.log("ResEdge ID running on port " + PORT);

});
