const successRes = (res, message) =>
    typeof message === 'string' ? 
        res.json({ status: 200, message }) : 
        res.json({ status: 200, ...message })


const errorRes = (res, status, error) =>
	res.status(status).json({
		status,
		error
    });
    
module.exports = {
    successRes,
    errorRes
}