const express = require('express');
const app = express();
const turtleRouter = require("./routes/turtle");
app.use(express.json());
//server configuration
app.set('port', process.env.PORT || 8080);

app.use('/turtle',turtleRouter);
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
})