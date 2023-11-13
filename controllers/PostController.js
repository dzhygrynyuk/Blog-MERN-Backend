import PostModel from '../models/Post.js';

class PostController {
    async create(req, res){
        try {
            const doc = new PostModel({
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            });

            const post = await doc.save();

            res.json(post);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Creating post error'
            });
        }
    }

    async getAll(req, res){
        try {
            const posts = await PostModel.find();

            res.json(posts);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error while get all posts'
            });
        }
    }
}

export default PostController;