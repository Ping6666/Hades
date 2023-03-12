const path = require('path');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: './tmp/',
    filename: function (req, file, cb) {
        try {
            const ori_name = path.parse(file.originalname).name;
            const timestamp = Date.now();
            const extension = path.extname(file.originalname);

            const save_name = ori_name + '_' + timestamp + extension;
            cb(null, save_name);
        } catch (err) {
            cb(err, false);
        }
    }
});

const fileFilter = (req, file, cb) => {
    const filetype = ["text/csv"];

    if (!filetype.includes(file.mimetype)) {
        const error = new Error("ERROR | file type");

        return cb(error, false);
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = {
    upload,
};
