//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-paras:Test123@cluster0.g9txaqg.mongodb.net/todolistDB");

const itemsSchema = {
  name:{type:String,sparse:true}
};
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"welcome to your todolist!"
});

const item2 = new Item({
  name:"Hit the + button to aff a new item."
})

const item3 = new Item({
  name:"<-- Hit this to delete an item."
})
const item4 = new Item({
  name:"paras"
});

const defaultItems = [item1,item2,item3,item4];

/*const listSchema={
  name:String,
  items:[itemsSchema]
}

const List = mongoose.model("list",listSchema);*/

async function findData(){
  const Items = await Item.find({});
 
  console.log("we are getting the items..");
  return Items;
};

app.get("/", function(req, res) {
  findData().then(function(foundItems){
  if (foundItems.length === 0){
    Item.insertMany(defaultItems)
      .then(function(){
        console.log("Successfully saved default items");
      })
      .catch(function(err){
        console.log(err);
      })
    //res.redirect("/");
  }
  else{
    
    res.render("list", {listTitle:"Today" , newListItems: foundItems});
  }
});

});


/*app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName;
  async function foundValue(){
    const foundList = await List.findOne({name: customListName});
    console.log("inside");
    return foundList;
  }
  foundValue().then(function(foundList){
    if(!foundList)
    {
      console.log("Does'nt exist!");
    }
    else{
      console.log("exist");
    }
  });
  const list = new List({
    name:customListName,
    items:defaultItems
  });
  list.save();
});*/

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  async function deleteData(){
    const response =  await Item.findByIdAndRemove(checkedItemId);
    console.log("Item deleted");
  }
  deleteData();
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
