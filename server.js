import app from './index.js'

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server listening at port ${port}`);
});


