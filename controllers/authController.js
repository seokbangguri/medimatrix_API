exports.getUser = async (req, res, next) => {
    let user = {
        name: 'Usmon',
        email: 'usmon@gmail.com'
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
}