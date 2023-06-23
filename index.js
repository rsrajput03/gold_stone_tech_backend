const express = require("express");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const { UserModel } = require("./models/users.models");
const { connection } = require("./db");
const cors = require("cors");
const { exportToCsv } = require("./csv");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const Token =
  "6693faa262b612dcc4e67431306e7674e6b335e6f6fc7bcf0da0a3b99677cd02";

// get the data
app.get("/users", async (req, res) => {
  try {
    const result = await axios.get("https://gorest.co.in/public-api/users", {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    const users = result.data.data;

    const finalUsers = users.map((el) => {
      return {
        ...el,
        Created_at: new Date().toISOString(),
        Updated_at: new Date().toISOString(),
      };
    });

    await UserModel.insertMany(finalUsers);

    res.json(finalUsers);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// export to csv
app.get("/update", async (req, res) => {
  try {
    const data = await UserModel.find();

    const csvData = exportToCsv(data);

    fs.writeFileSync("User_Master_Data.csv", csvData, "utf-8");

    res.download("User_Master_Data.csv", (error) => {
      if (error) {
        res.status(500).send({ message: error });
      }
      fs.unlinkSync("User_Master_Data.csv");
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

// CRUD Operation on Database

// get the data
app.get("/", async (req, res) => {
  try {
    const data = await UserModel.find();
    res.json(data);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// update the data
app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, gender, status } = req.body;
  try {
    const result = await UserModel.findByIdAndUpdate(
      { _id: id },
      { name, email, gender, status, Updated_at: new Date().toISOString() }
    );
    res.json({ message: "User Updated !", result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "Error occur": error });
  }
});

// delete the data
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let result = await UserModel.deleteOne({ _id: id });
    res.json({ message: "User deleted !", result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ "Error occur": error });
  }
});

// get data by id
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await UserModel.findById({ _id: id });
    res.json(data);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

app.listen(8000, async () => {
  try {
    await connection;
    console.log("Server is connected to MongoDB");
  } catch (error) {
    console.log("Server is not connected to MongoDB");
    console.log(error);
  }
  console.log("Server is running on port 8000");
});
