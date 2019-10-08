const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();
app.get("/", (req, res) => {
	res.json("hello");
});

app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/connection", require("./routes/connections"));
app.use("/api/createdConnection", require("./routes/CreatedConnection"));
app.use("/api/InterestedConnection", require("./routes/InterestedConnection"));
app.use("/api/status", require("./routes/status"));

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`server started on ${port}`);
});
