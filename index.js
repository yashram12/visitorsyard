import express, { json } from "express";
import path from "path";
import conn from "./db.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
const __dirname = path.resolve();

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend/build")));

const auth = (req, res, next) => {
  const token = req.header("authorization");

  if (!token)
    return res.status(401).json({
      message: "no token",
    });
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded.id;
    next();
  } catch (e) {
    console.log("invalid token");
    return res
      .status(400)
      .json({ status: "expired", message: "session expired  :.(" });
  }
};

app.get("/", async (req, res) => {
  res.send(`This is home route for the user ${req.user}`);
});

app.post("/api/v1/register", async (req, res) => {
  //getting data from client
  const { fname, lname, gender, phone, username, password } = req.body;

  //queries used in this route
  const select_phone_username = `SELECT PHONE,USERNAME FROM user U,auth A WHERE A.USER_ID=U.USER_ID;`;
  const select_uid = `SELECT USER_ID FROM user WHERE PHONE=${phone};`;
  const insert_user = `INSERT INTO user (FNAME,LNAME,GENDER,PHONE) VALUES('${fname}','${lname}','${gender}',${phone});`;
  const insert_auth = (result, pass) => {
    return `INSERT INTO auth VALUES(${result[0].USER_ID},'${username}','${pass}');`;
  };

  //quering db for phone and username
  conn.query(select_phone_username, (err, result) => {
    if (err) console.log(err);
    else {
      const phonelist = result.map((el) => el.PHONE);
      const usernamelist = result.map((el) => el.USERNAME);

      //checking for existing or new user using phone and username
      if (
        phonelist.indexOf(phone) == -1 &&
        usernamelist.indexOf(username) == -1
      ) {
        //quering db to insert user data into user table
        conn.query(insert_user, (err) => {
          if (err)
            res.status(400).json({
              message: "Invalid phone number",
            });
          else {
            //quering db for userid
            conn.query(select_uid, async (err, result) => {
              if (err) console.log(err);
              else {
                //hashing the password
                const pass = await bcrypt.hash(password, 10);

                //quering db to insert the login credentials into auth table
                conn.query(insert_auth(result, pass));
              }
            });

            res.status(200).json({
              message: "User Registered Successfully :) ",
            });
          }
        });
      } else {
        res.status(400).json({ message: "user already exists..." });
      }
    }
  });
});

app.post("/api/v1/login", async (req, res) => {
  //getting data from client
  const { username, password } = req.body;

  //queries used in this route
  const selectPass = `SELECT U.FNAME,A.USER_ID,A.PASSWORD FROM auth A,user U WHERE A.USER_ID=U.USER_ID AND USERNAME='${username}';`;

  //quering db for getting stored(hashed) password
  conn.query(selectPass, async (err, result) => {
    if (err) console.log(err);
    if (!result[0]) {
      res.status(401).json({
        message: "User not registered",
      });
    } else {
      //validating the password
      const valid = await bcrypt.compare(password, result[0].PASSWORD);
      if (valid) {
        const token = jwt.sign(
          { id: result[0].USER_ID, user: result[0].FNAME },
          process.env.SECRETKEY,
          {
            expiresIn: 600,
          }
        );
        res.status(200).json({
          status: "success",
          message: "User logged in successfully...:)",
          token,
        });
      } else res.status(401).json({ message: "Incorrect Password" });
    }
  });
});

app.get("/api/v1/user", auth, async (req, res) => {
  const uid = req.user;
  conn.query(
    `SELECT USERNAME,FNAME,LNAME,GENDER,PHONE FROM user U, auth A WHERE U.USER_ID = A.USER_ID AND U.USER_ID=${uid};`,
    (err, result) => {
      if (err) return res.status(501).json({ message: "user not found" });
      else {
        res.status(200).json({
          status: "success",
          data: result[0],
        });
      }
    }
  );
});

app.get("/api/v1/users", auth, async (req, res) => {
  conn.query(
    `SELECT U.USER_ID,U.FNAME,U.LNAME,U.PHONE,R.NO_OF_REVIEWS FROM user U LEFT OUTER JOIN USER_REVIEWS R ON U.USER_ID=R.USER_ID;`,
    (err, result) => {
      if (err) console.log(err);
      else {
        res.status(200).json({
          status: "success",
          data: result,
        });
      }
    }
  );
});

app.put("/api/v1/user", auth, async (req, res) => {
  const uid = req.user;
  if (!uid) {
    res
      .status(401)
      .json({ status: "not found", message: "no user to update..." });
  } else {
    const changed = Object.entries(req.body);
    changed.map((el) => {
      conn.query(
        `UPDATE user SET ${el[0]}='${el[1]}' WHERE USER_ID=${uid};`,
        (err) => {
          if (err)
            return res
              .status(501)
              .json({ status: "not found", message: "user not found..." });
        }
      );
    });
    res
      .status(200)
      .json({ status: "success", message: "user updated successfully  :)" });
  }
});

app.delete("/api/v1/user/:uid", auth, async (req, res) => {
  const uid = req.params.uid;
  conn.query(`DELETE FROM user WHERE USER_ID='${uid}';`, (err, result) => {
    if (err) console.log(err);
    else {
      res.status(200).json({
        status: "success",
        message: "User deleted successfully...",
      });
    }
  });
});

app.get("/api/v1/review/:pid", async (req, res) => {
  const pid = req.params.pid;
  conn.query(
    `SELECT R.RID,U.FNAME,R.RATING,R.RTITLE,R.RDESC FROM review R,user U WHERE R.USER_ID=U.USER_ID AND PLACE_ID='${pid}';`,
    (err, result) => {
      if (err)
        return res
          .status(501)
          .json({ message: "Place does not have any reviews" });
      else {
        res.status(200).json({
          status: "success",
          data: result,
        });
      }
    }
  );
});

app.post("/api/v1/review", auth, async (req, res) => {
  //rid,rtitle,rdesc,rating,placeid,userid
  const { rtitle, rdesc, img, rating, pid } = req.body;
  const uid = req.user;
  if (!rtitle || !rdesc || !rating)
    return res.status(400).json({ message: "data required" });
  else {
    conn.query(
      `SELECT MAX(CAST(SUBSTR(RID,2) AS UNSIGNED)) AS RID FROM review ;`,
      (err, result) => {
        if (err) console.log(err);
        else {
          let rid;
          if (result === []) rid = "R1";
          else rid = "R" + (result[0]["RID"] + 1).toString();
          conn.query(
            `INSERT INTO review VALUES('${rid}','${rtitle}','${rdesc}',${rating},'${pid}',${uid});`,
            (err) => {
              if (err) {
                console.log(err);
                return res
                  .status(400)
                  .json({ message: "rating must be in the range of 0-5" });
              } else {
                conn.query(
                  `SELECT MAX(CAST(SUBSTR(IMG_ID,2) AS UNSIGNED)) AS IMG_ID FROM image;`,
                  (err, result) => {
                    let imgId;
                    if (result === []) imgId = "I1111";
                    else imgId = "I" + (result[0]["IMG_ID"] + 1).toString();
                    conn.query(
                      `SELECT FNAME FROM user WHERE USER_ID='${uid}';`,
                      (err, result) => {
                        if (err) console.log(err);
                        else {
                          conn.query(
                            `INSERT INTO image VALUES('${result[0].FNAME}','${img}','${rid}','${pid}','${imgId}');`,
                            (err, result) => {
                              if (err) console.log(err);
                              else {
                                res.status(200).json({
                                  status: "success",
                                  message: "review updated successfully...",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                );
              }
            }
          );
        }
      }
    );
  }
});

app.get("/api/v1/review", auth, async (req, res) => {
  conn.query(
    `SELECT R.RID,R.RTITLE,R.RDESC,R.RATING,P.PLACE_NAME FROM review R,place P WHERE P.PLACE_ID=R.PLACE_ID AND R.USER_ID=${req.user};`,
    (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(501)
          .json({
            status: "success",
            message: "user does not have any reviews",
          });
      } else {
        res.status(200).json({
          status: "success",
          data: result,
        });
      }
    }
  );
});

app.delete("/api/v1/review/:rid", auth, async (req, res) => {
  const rid = req.params.rid;
  conn.query(`DELETE FROM review WHERE RID='${rid}';`, (err, result) => {
    if (err) console.log(err);
    else {
      res.status(200).json({
        status: "success",
        message: "Review deleted successfully...",
      });
    }
  });
});

app.get("/api/v1/coords/:pid", async (req, res) => {
  const pid = req.params.pid;
  conn.query(
    `SELECT LAT,LNG FROM coordinates WHERE PLACE_ID='${pid}';`,
    (err, result) => {
      if (err) console.log(err);
      else {
        res.status(200).json({
          status: "success",
          data: result,
        });
      }
    }
  );
});

app.get("/api/v1/places", async (req, res) => {
  conn.query(
    `SELECT P.PLACE_ID,P.PLACE_NAME,P.LOCATION,P.RATING,I.IMG FROM place P,image I WHERE P.PLACE_ID=I.PLACE_ID AND I.RID IS NULL ORDER BY RATING DESC;`,
    (err, result) => {
      if (err) console.log(err);
      else {
        res.status(200).json({
          status: "success",
          data: result,
        });
      }
    }
  );
});

app.get("/api/v1/places/:id", async (req, res) => {
  const id = req.params.id;
  conn.query(
    ` SELECT P.PLACE_ID,P.PLACE_NAME,P.LOCATION,P.TRIP_ID,P.RATING,P.DESCRIPTION,I.IMG FROM place P,image I WHERE P.PLACE_ID=I.PLACE_ID AND P.PLACE_ID='${id}' AND I.RID IS NULL;`,
    (err, result) => {
      if (err) console.log(err);
      else {
        if (result === []) {
          res.status(400).json({
            status: "notfound",
            message: "Place not found",
          });
        } else {
          res.status(200).json({
            status: "success",
            data: result,
          });
        }
      }
    }
  );
});

app.get("/api/v1/images/:id", async (req, res) => {
  const pid = req.params.id;
  conn.query(
    `SELECT I.IMG AS image,R.RTITLE AS caption FROM image I,review R WHERE I.RID=R.RID AND I.PLACE_ID='${pid}';`,
    (err, result) => {
      if (err) console.log(err);
      else {
        res.status(200).json({
          status: "success",
          data: result,
        });
      }
    }
  );
});

app.post("/api/v1/place", async (req, res) => {
  const { imgSrc, name, location, coordinates, data, star } = req.body;
  conn.query(
    `SELECT MAX(CAST(SUBSTR(PLACE_ID,2) AS UNSIGNED)) AS PID FROM place ;`,
    (err, result) => {
      if (err) console.log(err);
      else {
        let pid;
        if (result === []) pid = "P1111";
        else pid = "P" + (result[0]["PID"] + 1).toString();

        conn.query(
          `INSERT INTO place VALUES('${pid}','${name}','${location}',NULL,'${star}','${JSON.stringify(
            data
          )}');`,
          (err, result) => {
            if (err) console.log(err);
          }
        );
        conn.query(
          `SELECT MAX(CAST(SUBSTR(IMG_ID,2) AS UNSIGNED)) AS IMG_ID FROM image;`,
          (err, result) => {
            if (err) console.log(err);
            else {
              let imgId;
              if (result === []) imgId = "I1111";
              else imgId = "I" + (result[0]["IMG_ID"] + 1).toString();
              conn.query(
                `INSERT INTO image VALUES('${name}','${imgSrc}',NULL,'${pid}','${imgId}');`,
                (err, result) => {
                  if (err) console.log(err);
                }
              );
            }
          }
        );
        conn.query(
          `INSERT INTO coordinates VALUES('${pid}','${coordinates.lat}','${coordinates.lng}');`,
          (err, result) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                status: "success",
                message: "Place added successfully...",
              });
            }
          }
        );
      }
    }
  );
});

app.delete("/api/v1/place/:id", auth, async (req, res) => {
  const id = req.params.id;
  conn.query(`DELETE FROM place WHERE PLACE_ID='${id}';`, (err, result) => {
    if (err) console.log(err);
    else {
      res.status(200).json({
        status: "success",
        message: "Place deleted successfully...",
      });
    }
  });
});

app.get("/api/v1/tours/:id", async (req, res) => {
  const id = req.params.id;
  conn.query(
    `SELECT TRIP_ID,TRIP_NAME,DISTANCE,TIME FROM trip WHERE TRIP_ID='${id}';`,
    (err, result) => {
      if (err) console.log(err);
      else {
        conn.query(
          `SELECT P.PLACE_ID,P.PLACE_NAME,P.RATING,I.IMG,C.LAT,C.LNG from tripxplace T,place P,image I,coordinates C where T.PLACE_ID=P.PLACE_ID AND P.PLACE_ID=I.PLACE_ID AND C.PLACE_ID=P.PLACE_ID AND I.RID IS NULL AND T.TRIP_ID='${id}';`,
          (err, places) => {
            if (err) console.log(err);
            else {
              res.status(200).json({
                status: "success",
                data: {
                  trip: result[0],
                  places: places.map((place) => {
                    return {
                      placeId: place.PLACE_ID,
                      name: place.PLACE_NAME,
                      coordinates: { lat: place.LAT, lng: place.LNG },
                      star: place.RATING,
                      img: place.IMG,
                    };
                  }),
                },
              });
            }
          }
        );
      }
    }
  );
});

app.get("/api/v1/tours", async (req, res) => {
  conn.query(`SELECT * FROM trip;`, (err, result) => {
    if (err) console.log("error:" + err);
    else {
      res.status(200).json({
        status: "success",
        data: result,
      });
    }
  });
});

app.post("/api/v1/tour", (req, res) => {
  const { img, name, places, myLoc } = req.body;


  const calculateDistance = (
    lattitude1,
    longittude1,
    lattitude2,
    longittude2
  ) => {
    const toRadian = (n) => (n * Math.PI) / 180;

    let lat2 = lattitude2;
    let lon2 = longittude2;
    let lat1 = lattitude1;
    let lon1 = longittude1;

    // console.log(lat1, lon1 + "===" + lat2, lon2);
    let R = 6371; // km
    let x1 = lat2 - lat1;
    let dLat = toRadian(x1);
    let x2 = lon2 - lon1;
    let dLon = toRadian(x2);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    console.log("distance==?", d);
    return d;
  };

  const totDist = (myOriginalPos, list) => {
    let myPos;
    if (myOriginalPos.lat === 0){
      myPos = {lat:16.12,lng:77.21};
    }
    else{
      myPos = myOriginalPos;
    }
    let dis = 0,
      // myPos = myOriginalPos,
      minList = [],
      n = list.length;
    for (let i = 0; i < n; i++) {
      minList = list.map((el) => {
        return calculateDistance(myPos.lat, myPos.lng, el.lat, el.lng);
      });
      dis = dis + Math.min(...minList);
      [myPos] = list.splice(minList.indexOf(Math.min(...minList)), 1);
    }
    dis =
      dis +
      calculateDistance(
        myOriginalPos.lat,
        myOriginalPos.lng,
        myPos.lat,
        myPos.lng
      );
    return dis;
  };

  conn.query(
    `SELECT LAT AS lat,LNG AS lng FROM coordinates WHERE PLACE_ID IN (${places.map(
      (el) => {
        return "'" + el + "'";
      }
    )});`,
    (err, result) => {
      if (err) console.log(err);
      else {
        let distance = totDist(myLoc, result);
        conn.query(
          `SELECT MAX(CAST(SUBSTR(TRIP_ID,2) AS UNSIGNED)) AS TID FROM trip;`,
          (err, result) => {
            if (err) console.log(err);
            else {
              let tid;
              if (result === []) tid = "T1111";
              else tid = "T" + (result[0]["TID"] + 1).toString();

              conn.query(
                `INSERT INTO trip VALUES('${tid}','${name}',${parseInt(
                  distance
                )},${Math.ceil(distance / 400)},'${img}');`,
                (err, result) => {
                  if (err) console.log(err);
                  else {
                    places.map((place) => {
                      conn.query(
                        `INSERT INTO tripxplace VALUES('${tid}','${place}');`,
                        (err, result) => {
                          if (err) console.log(err);
                        }
                      );
                    });
                    res.status(200).json({
                      status: "success",
                      message: "Tour uploaded successfully....",
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

app.delete("/api/v1/tours/:id", auth, (req, res) => {
  const id = req.params.id;
  conn.query(`DELETE FROM trip WHERE TRIP_ID='${id}';`, (err, result) => {
    if (err) console.log(err);
    else {
      res.status(200).json({
        status: "success",
        message: "Tour deleted successfully...",
      });
    }
  });
});

app.post("/pub", (req, res) => {
  const { img, name, places, myLoc } = req.body;
  let distance = 0;

  const calculateDistance = (
    lattitude1,
    longittude1,
    lattitude2,
    longittude2
  ) => {
    const toRadian = (n) => (n * Math.PI) / 180;

    let lat2 = lattitude2;
    let lon2 = longittude2;
    let lat1 = lattitude1;
    let lon1 = longittude1;

    // console.log(lat1, lon1 + "===" + lat2, lon2);
    let R = 6371; // km
    let x1 = lat2 - lat1;
    let dLat = toRadian(x1);
    let x2 = lon2 - lon1;
    let dLon = toRadian(x2);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) *
        Math.cos(toRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    // console.log("distance==?", d);
    return d;
  };

  const totDist = (myPos, list) => {
    let dis = 0,
      minList = [],
      n = list.length;
    for (let i = 0; i < n; i++) {
      minList = list.map((el) => {
        return calculateDistance(myPos.lat, myPos.lng, el.lat, el.lng);
      });
      dis = dis + Math.min(...minList);
      [myPos] = list.splice(minList.indexOf(Math.min(...minList)), 1);
    }
    return dis;
  };
  console.log(
    places.map((el) => {
      return "'" + el + "'";
    })
  );
  conn.query(
    `SELECT LAT AS lat,LNG AS lng FROM coordinates WHERE PLACE_ID IN (${places.map(
      (el) => {
        return "'" + el + "'";
      }
    )});`,
    (err, result) => {
      if (err) console.log(err);
      else {
        distance = totDist(myLoc, result);
        conn.query(
          `SELECT MAX(CAST(SUBSTR(TRIP_ID,2) AS UNSIGNED)) AS TID FROM trip;`,
          (err, result) => {
            if (err) console.log(err);
            else {
              let tid;
              if (result === []) tid = "T1111";
              else tid = "T" + (result[0]["TID"] + 1).toString();
              console.log(
                tid,
                name,
                parseInt(distance),
                parseInt(distance / 400),
                img
              );
              conn.query(
                `INSERT INTO trip VALUES('${tid}','${name}',${parseInt(
                  distance
                )},${parseInt(distance / 400)},'${img}');`,
                (err, result) => {
                  if (err) console.log(err);
                  else {
                    places.map((place) => {
                      console.log(tid, place);
                      conn.query(
                        `INSERT INTO tripxplace VALUES('${tid}','${place}');`,
                        (err, result) => {
                          if (err) console.log(err);
                        }
                      );
                    });

                    res.status(200).json({
                      status: "success",
                      message: "Tour updated successfully...",
                      result: result,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

export default app;
