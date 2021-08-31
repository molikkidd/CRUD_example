const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
    app.set('view engine', 'ejs');
    //  app.use(expressLayouts);
    // allows us to store form data in the req.body to use on the page
    app.use(express.urlencoded({extended: false}));
    app.use(methodOverride('_method'));
   
// dinosaurs index page
app.get('/dinosaurs', function(req,res) {
    // read and analyze dinosaurs JSON file
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
    let dinoData = JSON.parse(dinosaurs);

    // get queried data from FORM
    const nameFilter = req.query.nameFilter;

  if (nameFilter) {
    //   filter thru dino JSON object
    dinoData = dinoData.filter(function(dino) {
        // return matching dino name
      return dino.name.toLowerCase() === nameFilter.toLowerCase();
    });
  }
    console.log(dinoData);
    // show the individual dino saur 
    res.render('dinosaurs/index', {myDinos: dinoData});
});

// add new dinosaur
app.get('/dinosaurs/new', function(req,res){
    res.render('dinosaurs/new');
});

// express show route for dinosaurs (list one dino at a time)
app.get('/dinosaurs/:idx', function(req,res) {
    // get dinosaurs
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinoData = JSON.parse(dinosaurs);
    // get array index from url parameter/ use req.params to get the value
    const dinoIndex = parseInt(req.params.idx);
    // render page with data to specified animal
    res.render('dinosaurs/show', {myDinos: dinoData[dinoIndex]});

});

app.post('/dinosaurs', function(req,res) {
    // read dinosaur file
    let dinosaurs = fs.readFileSync('./dinosaurs.json');
        dinosaurs = JSON.parse(dinosaurs);

    // add item to dinosaurs array
          dinosaurs.push(req.body);

    // save dinosaurs to the data.json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaurs))

    // redirect to the default/index dino page
    res.redirect('/dinosaurs');

    console.log(req.body);

})
// delete the dino from the json file and save the new one. 
app.delete('/dinosaur/:idx', function(req, res){
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinoData = JSON.parse(dinosaurs);

    // remove the deleted dino from the dino array
    dinoData.splice(req.params.idx, 1);

    // save the new dino to the data.json file
    fs.writeFileSync('./dinosaur.json', JSON.stringify(dinoData));
    // redirect back to the index, home page
    res.redirect('/dinosaurs');
})

// edit the post/PUT METHOD
app.get('/dinosaurs/edit/:idx', function(req, res) {
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinoData = JSON.parse(dinosaurs);
    res.render('dinosaurs/edit', {dino: dinoData[req.params.idx], dinoId: req.params.idx})
});

// add the edited information to the JSON File. 
app.put('/dinosaurs/:idx', function(req, res){
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinoData = JSON.parse(dinosaurs);
  
    //re-assign the name and type fields of the dinosaur to be editted
    dinoData[req.params.idx].name = req.body.name;
    dinoData[req.params.idx].type = req.body.type;
  
     // save the editted dinosaurs to the data.json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));
    res.redirect('/dinosaurs');
  });
console.log('crud app connected');
app.listen(8003);