const express = require('express');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); 
});

const { getAllTags } = require('../db');
const { getPostsByTagName } = require('../db');

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const { tagName } = req.params
  const newTagName = tagName.replace('%23', '#')
  try {
    // use our method to get posts by tag name from the db
    const postsWithTag = await getPostsByTagName(newTagName)
    // send out an object to the client { posts: // the posts }
    const returnedPosts = postsWithTag.filter(post => {
      // keep a post if it is either active, or if it belongs to the current user
      return post.active || (req.user && post.author.id === req.user.id);
    });
    res.send({ post:  returnedPosts})
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message });
  }
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags
  });
});

module.exports = tagsRouter;