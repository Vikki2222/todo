const express = require("express");
const {createTodo}= require("./types")
 const {updateTodo}= require("./types")
 const{todo}=require("./db")
const app = express();

app.use(express.json());

app.post("/todo",async function(req, res) {
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);
    if (!parsedPayload.success){
        res.status(411).json({
        msg: "you sent the wrong inputs"
      })
      return;
    }
    await todo.create({
      title:createPayload.title,
      description: createPayload.description,
      completed : false
    })
    res.json({
      msg:"todo created"
    })
})

app.get("/todo", async function (req, res) {
  try {
    const todos = await todo.find({});
    res.json({ todos });  // return all todos
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch todos" });
  }
});

app.put("/todo",async function(req, res){
    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);
    if (!parsedPayload.success){
        res.status(411).json({
        msg: "you sent the wrong inputs"
      })
      return;
    }
    await todo.update({
      _id: req.body.id
    },
  {
    completed:true
  })
  res.json({
    msg: "todo marked as completed"
  })

})
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
