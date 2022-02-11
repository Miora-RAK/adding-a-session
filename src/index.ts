import express from "express";
import nunjucks from "nunjucks";
import cookie from "cookie";

type User = {
  username: string;
  password: string;
};
const frieda: User = {
  username: "Frieda",
  password: "friedamotpasse",
};
const john: User = {
  username: "John",
  password: "johnmotpasse",
};

const customers: User[] = [frieda, john];

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.render("home");
});

app.get("/login", (request, response) => {
  response.render("login");
});

const formParser = express.urlencoded({ extended: true });

app.post("/private", formParser, (request, response) => {
  const user = request.body;
  console.log(user);
  response.set(
    "Set-Cookie",
    cookie.serialize("username", user.username, {
      maxAge: 3600,
    }),
  );
  console.log(customers.some((person) => person.password === user.password));
  if (
    customers.some((person) => person.username === user.username) &&
    customers.some((person) => person.password === user.password)
  ) {
    response.render("private", { user });
  } else {
    response.status(404).render("login", { error: "User not found" });
  }
});

app.get("/logout", (request, response) => {
  const user = request.body;
  console.log(user);
  response.set(
    "Set-Cookie",
    cookie.serialize("username", " ", {
      maxAge: 0,
    }),
  );
  response.render("home");
});

app.listen(4000, () => {
  console.log("Server started on http://localhost:4000");
});
