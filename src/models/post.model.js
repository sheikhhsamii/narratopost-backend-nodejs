import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300, // short preview text
    },
    content: {
      type: String,
      required: true, // full content
    },
    postImage: {
      type: String, // optional image url
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    isPublished: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook for slug generation
postSchema.pre("save", async function (next) {
  if (this.isModified("caption")) {
    this.slug = slugify(this.caption, { lower: true, strict: true });

    // Ensure slug is unique
    const Post = mongoose.model("Post", postSchema);
    let slugExists = await Post.findOne({ slug: this.slug });

    let counter = 1;
    while (slugExists) {
      this.slug = slugify(`${this.caption}-${counter}`, {
        lower: true,
        strict: true,
      });
      slugExists = await Post.findOne({ slug: this.slug });
      counter++;
    }
  }
  next();
});

export const Post = mongoose.model("Post", postSchema);
