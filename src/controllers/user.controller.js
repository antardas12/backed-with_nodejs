import { asyncHendler } from "../utils/aysncHendler.js"

const registerUser = asyncHendler(async (req, res) => {
    res.status(200).json({
        message: "cha khabi bhai"
    })
})

export { registerUser }