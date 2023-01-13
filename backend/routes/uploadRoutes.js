import express from 'express'
import multer from 'multer'
import {storage} from '../config/firebase.js'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {v4 as uuidv4} from 'uuid'

const router = express.Router()


// multer
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

router.post('/', upload.single('image') ,async (req, res) => {
    try {
        const file = req.file 
       // console.log(file)
        if(file && (file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg')) {
            const imageId = uuidv4();
            let imageUrl = ''
            let imagePath = ''
            const fileType = file.mimetype.substring(6);
           
            const storageRef = ref(storage, `/images/${imageId}.${fileType}`)
            await uploadBytes(storageRef, file.buffer).then(snapshot=> {
                imagePath = snapshot.metadata.fullPath
            })
            imageUrl = await getDownloadURL(ref(storage,imagePath));
            res.status(200).json({imageUrl});
        }else {
            res.status(500).json({message: 'Only jpeg, png and jpg file supported.'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Photo not uploaded, try again!'})
    }
})

export default router