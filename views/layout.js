function layout(title,content){

return `

<html>

<head>

<title>${title}</title>

<style>

body{
font-family:Arial;
background:#f4f6fb;
margin:0;
}

header{
background:#1e293b;
color:white;
padding:20px;
}

nav a{
color:white;
margin-right:20px;
text-decoration:none;
font-weight:bold;
}

.container{
max-width:900px;
margin:auto;
background:white;
padding:30px;
margin-top:30px;
border-radius:8px;
}

</style>

</head>

<body>

<header>

<h2>ResEdge ID</h2>

<nav>

<a href="/">Home</a>
<a href="/browse">Browse IDs</a>
<a href="/browse-authors">Browse Authors</a>
<a href="/browse-datasets">Browse Datasets</a>

</nav>

</header>

<div class="container">

${content}

</div>

</body>

</html>

`;

}

module.exports = layout;
