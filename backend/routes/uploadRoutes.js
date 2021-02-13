import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const __dirname = path.resolve()
        cb(null, path.join(__dirname, '/frontend/public/uploads'))
    },
    filename(req, file, cb) {
        cb(
            null, 'image' + Date.now() + path.extname(file.originalname)
        )
    },
})

function checkFileType(file, cb) {

    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        return cb(null, true)
    } else {
        cb('Images only!')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})

router.post('/', upload.single('image'), (req, res) => {
    res.send(`/uploads/${req.file.filename}`)
})

export default router