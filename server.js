const fs = require("fs");
const fetch = require("node-fetch");

const data = fs.readFileSync("./locations.csv", { encoding: "utf8" });
handelData(data);

async function handelData(data) {
  let rows = data.split("\n");
  let locations = [];

  for (let i = 0; i < rows.length; i++) {
    try {
      let row = rows[i].split(",");
      let location = {
        title: row[0].trim(),
        address1: row[1].trim(),
        address2: row[2].trim() + ", TX",
      };

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${
          location.address1 + location.address2
        }&key=AIzaSyCPwDDHlHIMYEjm7tBb3I19zWFNsLIq38o`
      );

      const data = await res.json();

      if (data.results[0]) {
        location.coords = data.results[0].geometry.location;
      } else {
        location.coords = { lat: 39, lng: -104 };
      }
      if (!location.title.includes("?")) locations.push(location);
    } catch (err) {
      console.error(err);
    }
  }

  fs.writeFile("./locations.json", JSON.stringify(locations), (err) => {
    if (err) console.error(err);
  });
}
