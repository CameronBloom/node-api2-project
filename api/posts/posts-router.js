// implement your posts router here
const express = require("express")
const router = express.Router()
const Post = require("./posts-model")

router.get("/", (req, res) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({
        message: "The posts information could not be retrieved",
        err: err.message,
        stack: err.stack,
      })
    })
})

router.get("/:id", async (req, res) => {
  try {
    const exists = await Post.findById(req.params.id)
    if (exists) {
      res.json(exists)
    } else {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      })
    }
  } catch(err) {
    res.status(500).json({
      message: "The post information could not be retrieved",
      err: err.message,
      stack: err.stack,
    })
  }
})

router.post("/", (req, res) => {
  const { title, contents } = req.body
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    })
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id)
      })
      .then(newPost => {
        res.status(201).json(newPost)
      })
      .catch(err => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
          err: err.message,
          stack: err.stack,
        })
      })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const exists = await Post.findById(req.params.id)
    if (!exists) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      })
    } else {
      await Post.remove(req.params.id)
      res.json(exists)
    }
  } catch (err) {
    res.status(500).json({
      message: "The post could not be removed",
      err: err.message,
      stack: err.stack,
    })
  }
})

router.put("/:id", (req, res) => {
  const { title, contents } = req.body
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post",
    })
  } else {
    Post.findById(req.params.id)
      .then(post => {
        if (!post) {
          res.status(404).json({
            message: "The post with the specified ID does not exist",
          })
        } else {
          return Post.update(req.params.id, req.body)
        }
      })
      .then(returned => {
        if (returned) {
          return Post.findById(req.params.id)
        }
      })
      .then(updated => {
        if (updated) {
          res.json(updated)
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "The posts information could not be retrieved",
          err: err.message,
          stack: err.stack,
        })
      })
  }
})
module.exports = router