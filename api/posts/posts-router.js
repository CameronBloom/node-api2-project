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

module.exports = router