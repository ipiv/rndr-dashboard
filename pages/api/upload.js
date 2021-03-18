// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import formidable from "formidable";
import path from 'path'

export const config = {
  api: {
    bodyParser: false
  }
};

export default (req, res) => {
  if (req.method === 'POST') {
    console.log(process.cwd())
    console.log(path.join(process.cwd(), 'uploads'))
    const form = new formidable.IncomingForm({
      // multiples: true,
      uploadDir: `uploads`,
      keepExtensions: true
    });
    form.parse(req, function(err, fields, files) {
      res.statusCode = 200
      res.json({ success: true })
    });
  } else {
    res.status(500)
  }
  return
}
