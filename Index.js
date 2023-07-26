const express = require("express");
const app = express();
const port = 3000;
const meals = require("./data/meals");

// app.get, app.delete, app.pstch, app.put, app.set,app.listen,
//status code 200
// setting the view engine
app.set("view engine", "ejs");
//middleware
app.use(express.json()); // parse json data

// get all meals
app.get("/api/meals", (req, res) => {
    res.status(200).json({ numOfMeals: meals.length, meals });
});

// get a single meal
app.get("/api/meals/:mealId", (req, res) => {
    // req.params
    //console.log(req, params.mealId);
    const { mealId } = req.params;
    const meal = meals.find((meal) => meal.id === parseInt(mealId));
    if (!meal) {
        return res.status(404).json({
            message: `Meal with the id ${mealId} not found`,
            success: false
        });
}
    res.status(200).json({ success: true, meal });
});

// create a meal - name themeal
app.post("/api/meals", (req, res) => {
    //req.body
    console.log(req.body);
    const { name } = req.body
    if (!name) {
        return res.status(400).json({ message: "please provide a meal name" });
    }
    const newMeal = { id: 7, name };
    res.status(201).json({ succes: true, meals: [...meals, newMeal] });
});
 // update a meal
 // find what we want to update - get sth // undefind
 // provide
app.patch(`/api/meals/:mealId`, (req, res) => {
    const { mealId } = req.params;
    const { name } = req.body;

    const meal = meals.find((meal) => meal.id === Number(mealId));
    if (!meal) {
        return res.
            status(404)
            .json({ message: `meal with the id ${mealId} not found` });
    }
    if (!name) {
        return res.status(400).json({ message: " please provide a new meal name" });
    }
    const mealToBeUpdate = meals.map((meal) => {
        if (meal.id === Number(mealId)) {
            meal.name = name
    }
        return meal;
    });
    return res.status(200).json({ success: true, meals: mealToBeUpdate});
});

app.delete("/api/meals/:meadId", (req, res) => {
    const { mealId } = req.params;

    const meal = meals.find((meal) => meal.id === Number(mealId));
    if (!meal) {
    return res.
            status(404)
            .json({ message: `meal with the id ${mealId} not found` });
}
    const remainingMeals = meals.filler((meal) => meal.id !== parseInt(mealId));
    res.status(200).json({ success: true, meals: remainingMeals });

});

app.use((req, res, next) => {
    console.log("request made");
    next();
});
app.use((req, res, next) => {
    const requestInfo = {
        url: req.url,
        method: req.method,
        time: new Date().getDate(),
    };
    console.log(requestInfo);
    next();
});

const auth = (req, res, next) => {
    const authorized = false;
    if (authorized) {
       next();
    } else {
        res.send("YOU ARE NOT AUTHORIZED");
   }
};

app.get("/account", auth, (req, res) => {
    res.status(200).send("YOUR ACCOUNT DETAILS");
});

app.get("/", (req, res) => {
    const user = "John Doe";
    const role = "Fullstack engineer";
    res.status(200).render("index",{ user, role });
});
app.get("/about", (req, res) => {
    res.status(200).render("about")
});

//redirecting
app.get("/about-us", (req, res) => {
    res.redirect("/about");
});
// error route
// app.all("*", (req, res) => {
//     res.status(404).send("error page");
// });
app.use((req, res) => {
    res.status(404).render("error");
});

app.listen(port, () => {
    console.log(`server running on port ${port}...`);
});