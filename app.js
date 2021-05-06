const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
////***********+connecting to the DB with mongoose******///////////////
mongoose.connect("mongodb://localhost:27017/favoritesDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
///*******************Schema**************/////////
const itemsSchema = {
  name: String,
  price: String,
  imgURL: String
}
///******************model********************//////////////
const Item = mongoose.model("Item", itemsSchema);
////***************Routes*******************////////////////
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/favoritos", function(req, res) {
  Item.find({}, function(err, foundItems) { //busca todos los item que hay en la DB
    if (foundItems.length === 0) { //si no hay
      console.log("no hay favoritos");
      res.render("sinFavoritos")
    } else {
      console.log(foundItems);
      res.render("favoritos", {
        listItems: foundItems
      });
    }
  });
});
////*****************+product search *********************/////////////////
app.post("/products", function(req, res) {
  console.log(req.body.item);
  const query = req.body.item;
  //const apiKey ="";
  const url = "https://api.mercadolibre.com/sites/MLA/search?q=" + query;
  //asking for data to the Mercado libre apiKey
  https.get(url, function(response) {
    let result = "";
    console.log(response.statusCode);
    response.on("data", function(data) { //wait until we get all the data
      result += data; //adding every result till the end
    });
    response.on("end", function() {
      var productsData = JSON.parse(result);
      res.render("products", {
        productsDataEjs: productsData
      });
    });
  });
});
///////****************Add favorite product**************////////////
app.post("/add", function(req, res) {
  const name = req.body.itemName;
  const precio = req.body.itemPrice;
  const imagen = req.body.itemImg;
  console.log(name + " " + precio + " " + imagen);
  const item = new Item({ //creamos un nuevo documento para añadirlo a la base
    name: req.body.itemName,
    price: req.body.itemPrice,
    imgURL: req.body.itemImg
  });
  item.save();
  console.log("item saved to the DB");
  res.redirect("/favoritos");
});
//////*************Delete product from favorite list**********//////////////
app.post("/delete", function(req, res) {
  console.log(req.body.id);
  const checkedItemId = req.body.id;
  //eliminamos el item de la base de datos
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      console.log("Succesfully deleted");
      //redireccionamos para que se reflejen los cambios
      res.redirect("/favoritos");
    }
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
