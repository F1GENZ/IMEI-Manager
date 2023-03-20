import multer from "multer";

var excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // file added to the public folder of the root directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const excelUploads = multer({ storage: excelStorage } );
export default excelUploads;
