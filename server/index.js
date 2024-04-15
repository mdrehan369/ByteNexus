import "dotenv/config"
import { app } from "./app.js"
import { connect } from "./connectDB.js"

const PORT = process.env.PORT || 3000

connect()
.then((val) => {
    app.listen(PORT, () => {
        console.log(`Listening on port http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.log("error on connecting with database " + err);
})

