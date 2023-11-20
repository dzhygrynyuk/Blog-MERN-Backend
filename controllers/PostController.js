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
            const posts = await PostModel.find().populate('user').exec();

            res.json(posts);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error while get all posts'
            });
        }
    }

    async getItem(req, res){
        try {
            const postId = req.params.id;

            const doc = await PostModel.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    $inc: { viewsCount: 1 }
                },
                {
                    returnDocument: 'after'
                }
            ).populate('user').exec();

            if(!doc){
                return res.status(404).json({
                    message: 'Not found post'
                });
            }

            res.json(doc);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error while get post item'
            });
        }
    }

    async remove(req, res){
        try {
            const postId = req.params.id;

            const doc = await PostModel.findOneAndDelete({ _id: postId });

            if(!doc){
                return res.status(404).json({
                    message: 'Not found post'
                });
            }

            res.json({
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Detelete post error'
            });
        }
    }

    async update(req, res){
        try {
            const postId = req.params.id;

            await PostModel.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    title: req.body.title,
                    text: req.body.text,
                    imageUrl: req.body.imageUrl,
                    tags: req.body.tags,
                }
            );
            
            res.json({
                success: true
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Update post error'
            });
        }
    }

    async getLastTags(req, res){
        try {
            const posts = await PostModel.find().limit(5).exec();
            const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

            res.json(tags);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error while get tags'
            });
        }
    }
}

export default PostController;