```javascript
function layout(title, content) {

return `

<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<title>${title}</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<style>

/* GLOBAL */

*{
box-sizing:border-box;
}

body{
margin:0;
font-family:"Segoe UI", Arial, sans-serif;
background:#f1f5f9;
color:#1e293b;
line-height:1.6;
}

/* HEADER */

header{
background:#0f172a;
color:white;
padding:18px 40px;
display:flex;
justify-content:space-between;
align-items:center;
}

header h2{
margin:0;
font-size:22px;
letter-spacing:0.5px;
}

nav a{
color:#cbd5f5;
margin-left:20px;
text-decoration:none;
font-size:14px;
}

nav a:hover{
color:white;
}

/* MAIN CONTAINER */

.container{
max-width:1000px;
margin:auto;
padding:30px;
}

/* CARD */

.card{
background:white;
padding:30px;
border-radius:10px;
box-shadow:0 5px 15px rgba(0,0,0,0.06);
margin-bottom:25px;
}

/* HEADINGS */

h1,h2,h3{
margin-top:0;
}

/* LABELS */

label{
display:block;
font-size:14px;
margin-bottom:4px;
color:#334155;
}

/* INPUTS */

input,
textarea{
width:100%;
padding:10px;
border:1px solid #cbd5e1;
border-radius:6px;
margin-bottom:15px;
font-size:14px;
}

textarea{
resize:vertical;
}

/* BUTTON */

button{
background:#2563eb;
border:none;
padding:10px 18px;
color:white;
border-radius:6px;
cursor:pointer;
font-size:14px;
}

button:hover{
background:#1d4ed8;
}

/* TABLE */

table{
width:100%;
border-collapse:collapse;
margin-top:10px;
}

th{
background:#f1f5f9;
text-align:left;
padding:12px;
font-size:14px;
}

td{
padding:12px;
border-top:1px solid #e2e8f0;
font-size:14px;
}

tr:hover{
background:#f8fafc;
}

/* IDENTIFIER BADGE */

.badge{
display:inline-block;
background:#e0e7ff;
color:#3730a3;
padding:6px 10px;
border-radius:6px;
font-size:13px;
margin-bottom:10px;
}

/* LINKS */

a{
color:#2563eb;
text-decoration:none;
}

a:hover{
text-decoration:underline;
}

/* FOOTER */

footer{
margin-top:40px;
padding:25px;
text-align:center;
font-size:13px;
color:#64748b;
}

</style>

</head>

<body>

<header>

<h2>ResEdge ID</h2>

<nav>

<a href="/">Home</a>
<a href="/create">Create</a>
<a href="/browse">Identifiers</a>
<a href="/browse-authors">Authors</a>
<a href="/browse-datasets">Datasets</a>
<a href="/search">Search</a>

</nav>

</header>

<div class="container">

<div class="card">

${content}

</div>

</div>

<footer>

ResEdge ID Registry • Research Edge and Publication Pvt Ltd

</footer>

</body>

</html>

`;
}

module.exports = layout;
```
