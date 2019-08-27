var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Book = require('./Book.model') // Book model

//connection string to mongo
mongoose.connect('mongodb://localhost/NodeCRUD', {useNewUrlParser: true });//actually connect to mongo

var port = 8080;

app.use(bodyParser.json());//parse json elements
app.use(bodyParser.urlencoded({
    extended: true
}))//give and recieve body elements (used w/ postman)

app.get('/', function(req, res){
    res.send('hii');
})

app.get('/book', (req, res) => {
    console.log('getting all books');
    Book.find({})
    .exec((err, books) => {
        if(err){
            console.log('An error occured', err);
        } else{
            console.log(books)
            res.json(books)
        }
    });
});

app.get('/book /:id', (req, res) => {
    Book.findOne({
        _id:req.params.id
    })
    .exec((err, book) => {
        if(err){
            console.log('Error  getting 1 book ', err)
        } else {
            console.log(book);
            res.json(book);
        }
    })
})


app.post('/book', (req, res) => {
    var newBook = new Book();

    newBook.title = req.body.title;
    newBook.author = req.body.author;
    newBook.category = req.body.category;

    newBook.save((err, book) => {
        if(err){
            console.log('There was an error saving the book ', err);
        } else {
            console.log(book);
            res.send(book);
        }
    });
});

//Second post method
// app.post('/book', (req,res) => {
//     Book.create(req.body, (err, book) => {
//         if(err){
//             console.log('error saving book', err);
//         } else {
//             console.log(book);
//             res.send(book);
//         }
//     })
// })

app.put('/book/:id', ( req, res) => {
    Book.findOneAndUpdate({
        _id: req.body.id
    }, {$set: {title: req.body.title}} ,{ upsert: true },
    (err, newBook) => {
        if(err){
            console.log('error occured when trying to update book', err);
        } else {
            console.log(newBook);
            res.send(newBook);
        }
    })
})

app.delete('/book/:id', (req, res) => {
    Book.findOneAndRemove({_id: req.params.id}, (err, book) => {
        if(err){
            console.log('error removing book', err);
        } else {
            console.log(book);
            res.status(204);
        }
    })
})

app.listen(port, () => {console.log('Listening on port ' + port)});