import Report from '../models/reports.model.js';

const create = async (req, res) => {
  let report = req.body;
  report.username = req.user._json.email;

  if (!report) {
    return res.status(404).send({
      error: "Report not found",
    });
  }
  await new Report(report).save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

const getAllReports = async (req, res) => {
  await Report.find()
    .then(reports => res.json(reports))
    .catch(err => res.status(500).json('Error: ' + err));
};

export default {
  create,
  getAllReports,
};