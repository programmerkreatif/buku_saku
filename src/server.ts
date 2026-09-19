import express from "express";

const app = express();

const PORT = 9000;

app.use(express.json());

app.get("/api/hello", (req, res) => {  
    res.json({
    	success:true,
	message:"Hello, world nodejs exploration"
    });
});


app.listen(PORT, () => {
    console.log(`Listening port:${PORT}`);
});


export default app;