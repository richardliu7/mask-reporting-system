import Report from '../models/reports.model.js';

const getCoords = async (req, res) => {
  await Report.find()
    .then(
      reports => {
        let coords = [];
        reports.forEach(report => {
          coords.push({
            lat: report.lat,
            lng: report.lng,
            num_maskless: report.num_maskless
          });
        });
        res.json(coords);
      }
    )
  // .catch(err => res.status(500).json('Error: ' + err));
}

// Gets coordinates for heat map based on inside vs. outside and date
const getFilteredCoords = async (req, res) => {
  let date = req.query.date; // new Date(req.params.date); //  Date.parse(req.params.date)
  let includeInside = (req.query.inside === "true");
  let includeOutside = (req.query.outside === "true");

  console.log("date = " + date);

  // Show reports from inside and outside
  if (includeInside && includeOutside) {
    await Report.
    find({
        createdAt: {
          $gte: date
        }
      })
      .then(
        reports => {
          let coords = [];
          reports.forEach(report => {
            coords.push({
              lat: report.lat,
              lng: report.lng,
              num_maskless: report.num_maskless
            });
          });
          res.json(coords);
        })
  }
  // Show reports from inside only
  else if (includeInside || includeOutside) {
    await Report.
    find({
        createdAt: {
          $gte: date
        },
        is_inside: includeInside
      })
      .then(
        reports => {
          let coords = [];
          reports.forEach(report => {
            coords.push({
              lat: report.lat,
              lng: report.lng,
              num_maskless: report.num_maskless
            });
          });
          res.json(coords);
        })
  } else {
    console.log("Error - unexpected case");
    res.status(400).send(new Error('Unexpected query params'));
  }
}

export default {
  getCoords,
  getFilteredCoords
};