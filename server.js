const fs = require("fs");
const fetch = require("node-fetch");

const data = fs.readFileSync("./locations.csv", { encoding: "utf8" });
handelData(data);

function handelData(data) {
  let rows = data.split("\n");
  let locations = [];
  let count = 1;

  for (let i = 1; i < rows.length; i++) {
    let row = rows[i].split(",");
    let location = {
      title: row[1].trim(),
      address1: row[2].trim(),
      address2: row[0].trim() + ", CA",
    };

    let index = location.title.indexOf("(");
    if (index && index !== -1) {
      let newName = location.title.slice(index + 1, -1);
      location.title = newName.trim();
    }

    location.address1 = location.address1.slice(1);
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${location.address1}&key=AIzaSyA6FRSEdL1435b7MGz5_jdkoi8eHK5H9-k`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results[0]) {
          location.coords = data.results[0].geometry.location;
        } else {
          location.coords = { lat: 39, lng: -104 };
        }
        if (!location.title.includes("?")) locations.push(location);
        if (count === rows.length - 1) {
          fs.writeFile("./locations.json", JSON.stringify(locations), (err) => {
            if (err) console.error(err);
          });
        }
        count++;
      });
  }
}
