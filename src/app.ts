require('dotenv').config();
import getMiddlewares from "./Middlewares";
import { APIMethod } from "./Utils/APITypes";
const express = require("express");
import routes from "./Routers/Router";
import swaggerUi from "swagger-ui-express";
import fileUpload from "express-fileupload";
import swaggerDocs from "./Utils/Swagger";

const cors = require('cors');
const app = express();


let options = {
    redirect: false
}

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.static('public', options));
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

for (let route of routes) {
    let mids = getMiddlewares(route);
    switch (route.Method) {
        case APIMethod.get:
            app.get("/api" + route.Path , ...mids , route.Controller);
            break;
        case APIMethod.post:
            app.post("/api" + route.Path , ...mids , route.Controller);
            break;
        case APIMethod.put:
            app.put("/api" + route.Path , ...mids , route.Controller);
            break;
        case APIMethod.delete:
            app.delete("/api" + route.Path , ...mids , route.Controller);
            break;
    }
}

const port = process.env.APP_PORT || "";

app.listen(port, () => {
    console.log(`Server is Running On ${port}`);
    swaggerDocs(app,parseInt(port));
})


