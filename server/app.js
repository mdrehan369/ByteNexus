import express from "express"
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";
import commentRouter from "./routes/comment.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/comments", commentRouter);

app.get("/", (req, res) => {
    res.send("hello");
});

export { app };
