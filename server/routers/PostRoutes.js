// postRouter.js
import express from 'express';
import Post from '../models/post.js';
import { authenticateToken, isAdmin, isUser } from './middlewere.js';

const router = express.Router();

// Route to create a post (admin and user both can create posts)
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { title, description, image, isPrivate } = req.body;
        let userId;

        if (req.user && req.user.role === 'admin') {
            userId = req.user.id;
        } else if (req.user && req.user.role === 'user') {
            userId = req.user.id;
        } else {
            return res.status(401).json({ msg: 'Unauthorized: Invalid role' });
        }

        const existingPost = await Post.findOne({ title, description });

        if (existingPost) {
            return res.status(400).json({ msg: 'Post with the same title and description already exists' });
        }

        const newPost = new Post({
            userId,
            title,
            description,
            image,
            isPrivate,
            postedDate: new Date(),
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error(err);

        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

// Route to edit a post
router.put('/:postId', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, description, image, isPrivate } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (req.user && req.user.role === 'admin') {
        } else if (req.user && req.user.role === 'user') {
            if (post.userId.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Forbidden: User cannot edit this post' });
            }
        } else {
            return res.status(401).json({ msg: 'Unauthorized: Invalid role' });
        }

        post.title = title;
        post.description = description;
        post.image = image;
        post.isPrivate = isPrivate;

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});


// Route to delete a post
router.delete('/:postId', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.postId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (req.user && req.user.role === 'admin') {
        } else if (req.user && req.user.role === 'user') {
            if (post.userId.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Forbidden: User cannot delete this post' });
            }
        } else {
            return res.status(401).json({ msg: 'Unauthorized: Invalid role' });
        }

        await Post.deleteOne({ _id: postId });
        res.json({ msg: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});


// Route to read all posts (only for admin)
router.get('/posts', authenticateToken, isAdmin, async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

// Route to read all user posts by user (only for admin)
router.get('/user/:userId', authenticateToken, isAdmin, async (req, res) => {
    try {
        const userId = req.params.userId;
        const userPosts = await Post.find({ userId });

       // res.setHeader('Cache-Control', 'no-cache');

        res.json(userPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

// Route to read all posts posted by the user (only for corresponding user)
router.get('/user', authenticateToken, isUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const userPosts = await Post.find({ userId });
        res.json(userPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

// Route to read a particular post (any post by the admin, their own post by user)
router.get('/:postId', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        if (req.user && req.user.role === 'admin') {
        } else if (req.user && req.user.role === 'user') {
            if (post.userId.toString() !== req.user.id) {
                return res.status(403).json({ msg: 'Forbidden: User cannot view this post' });
            }
        } else {
            return res.status(401).json({ msg: 'Unauthorized: Invalid role' });
        }

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

// Pagination route (example)
/* router.get('/posts/page/:page', async (req, res) => {
    try {
        const page = req.params.page || 1;
        const limit = 10; // Number of records per page
        const skip = (page - 1) * limit;

        const posts = await Post.find().skip(skip).limit(limit);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
}); */
// Pagination route (example)
router.get('/page/:page', authenticateToken, async (req, res) => {
    try {
        const page = req.params.page || 1;
        const limit = 10; 
        const skip = (page - 1) * limit;

        let query = {}; 

        if (req.user && req.user.role === 'admin') {
        } else if (req.user && req.user.role === 'user') {
            query.userId = req.user.id;
        } else {
            return res.status(401).json({ msg: 'Unauthorized: Invalid role' });
        }

        const posts = await Post.find(query).skip(skip).limit(limit);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error', error: err.message });
    }
});

export default router;







