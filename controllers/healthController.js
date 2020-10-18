exports.healthCheck = (req, res) => {
    return res.status(200).json({message: "Health Check Passed"});
}