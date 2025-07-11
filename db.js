const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://new:new@pro1.rihj3jp.mongodb.net/")
 const todoSchema = mongoose.Schema({
    title: String,
    description:String,
    completed: Boolean

 })
 const todo = mongoose.model('todos', todoSchema);

 module.exports ={
    todo
 }