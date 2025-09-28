
//Require and constants:
const express = require("express")
const app = express()
const path = require("path")
const fs = require('fs') 
const uuid = require("uuid") //installed with npm install uuid
//ejs and view engine:
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Middleware for static files:
app.use(express.static("public"))
app.use(express.urlencoded({extended:false}))



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
//server works: 
app.get("/", (req, res) => {
    res.send("<p>todoApp</p>")
})
    */

/*
app.get('/',function(req,res){
    const filePath = path.join(__dirname,'data','data_todoApp.json')

    const fileData =  fs.readFileSync(filePath)
    const tasks = JSON.parse(fileData)

    res.render("todoApp", {numberOfTasks : data_todoApp.length, storedTasks :tasks})
})
/*
router.get('/restaurants/:rid',function(req,res){
    // To send back the right restaurant details!
    const restaurantId = req.params.rid
    //console.log(restaurantId)

   // const filePath = path.join(__dirname,"..",'data','restaurants.json')
    //const fileData = fs.readFileSync(filePath)

    //const restaurants = JSON.parse(fileData)

    const restaurants = resUtils.getStoredRestaurants()

    for(const restaurant of restaurants){
        if(restaurantId === restaurant.rId){
           return res.render('restaurant-details',{restaurant}) 
        }
    }
})
*/


//Save tasks in data_todoApp.json:
app.post("/data_todoApp",function(req,res){
    const task = req.body
    task.uId = uuid.v4()

    const fileDataPath = path.join(__dirname, "data", "data_todoApp.json")
    const fileData = fs.readFileSync(fileDataPath)
    const tasks = JSON.parse(fileData)
    tasks.push(task)
    fs.writeFileSync(fileDataPath, JSON.stringify(tasks))
    //res.send("User stored successfully!");
    res.redirect("/")
})

//retrive list of restaurants from json file: 
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "data", "data_todoApp.json")
    const fileData = fs.readFileSync(filePath)
    const tasks = JSON.parse(fileData)
    console.log("Tasks loaded:", tasks)
    res.render("todoApp", {numberOfTasks : tasks.length, storedTasks :tasks})
})

//Edit task by id: 
app.post("/tasks/:uid/edit", (req, res) => {
    const taskId = req.params.uid;
    const updatedData = req.body;

    const filePath = path.join(__dirname, "data", "data_todoApp.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const tasks = JSON.parse(fileData);

    const taskIndex = tasks.findIndex(t => t.uId === taskId);
    if (taskIndex === -1) return res.status(404).send("Task not found");

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        task: updatedData.task,
        taskDate: updatedData.taskDate,
        taskField: updatedData.taskField
    };

    fs.writeFileSync(filePath, JSON.stringify(tasks));

    res.redirect("/");
});

// Delete the task
app.get('/tasks/:uId/delete', function(req, res) {
    // retrieve the id of the task to be deleted:
    const taskId = req.params.uId;
    
    // Retrieve all tasks:
    const fileDataPath = path.join(__dirname, 'data', 'data_todoApp.json');
    const fileData = fs.readFileSync(fileDataPath);
    const tasks = JSON.parse(fileData);

    // find the task with a filter():
    const filteredTasks = tasks.filter(t => t.uId !== taskId);

    // store the updated tasks
    fs.writeFileSync(fileDataPath, JSON.stringify(filteredTasks));

    // redirect to home page
    res.redirect('/');
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(3000)





