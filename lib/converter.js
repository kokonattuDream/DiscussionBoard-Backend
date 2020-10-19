module.exports.convertPostModelToObj = (model) => {
    let postObject = {
        _id: postModel._id,
        title: postModel.title,
        user: {
          username: req.session.user.username
        },
        text: postModel.text,
        createDate: postModel.createDate,
        updatedDate: postModel.updatedDate,
        region: postModel.region,
        imageId: postModel.imageId,
        imageUrl: postModel.imageUrl,
        replies: []
    };
}