import { ApiError } from "../utils/ApiError.js"
import { blogModel, userModel, likeModel, viewsModel } from "../models/index.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"

const getBlogsController = async (req, res) => {
  try {
    const { title, isAll, topics, id } = req.query;

    const likeLookup = {
      '$lookup': {
        'from': 'likes',
        'localField': '_id',
        'foreignField': 'blog',
        'as': 'likedBy'
      }
    }

    const commentLookup = {
      '$lookup': {
        'from': 'comments',
        'localField': '_id',
        'foreignField': 'blog',
        'as': 'commentBy'
      }
    }

    const viewsLookup = {
      '$lookup': {
        'from': 'views',
        'localField': '_id',
        'foreignField': 'blog',
        'as': 'viewedBy'
      }
    }

    const addFields = {
      '$addFields': {
        'blogUser': {
          '$first': '$userDetails'
        },
        'totalLikes': {
          '$size': '$likedBy'
        },
        'totalComments': {
          '$size': '$commentBy'
        },
        'totalViews': {
          '$size': '$viewedBy'
        }
      }
    }

    const sortingStage = {
      '$sort': {
        'createdAt': -1
      }
    }

    const projectStage = {
      '$project': {
        'title': 1,
        'description': 1,
        'totalLikes': 1,
        'totalComments': 1,
        'totalViews': 1,
        'frontImage': 1,
        'blogUser': 1,
        'createdAt': 1,
        'topics': 1
      }
    }

    let userLookup;
    let pipeline;

    if (parseInt(isAll)) {
      userLookup = {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$project': {
                'name': 1,
                'username': 1,
                'profilePic': 1
              }
            }
          ],
          'as': 'userDetails'
        }
      }
      pipeline = [
        userLookup,
        likeLookup,
        commentLookup,
        viewsLookup,
        addFields,
        sortingStage,
        projectStage
      ];
    } else {
      userLookup = {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$addFields': {
                'doesFollow': {
                  '$in': [
                    new mongoose.Types.ObjectId(id), '$followers'
                  ]
                }
              }
            },
            {
              '$project': {
                'name': 1,
                'username': 1,
                'profilePic': 1,
                'followers': 1,
                'doesFollow': 1
              }
            }
          ],
          'as': 'userDetails'
        }
      }
      pipeline = [
        userLookup,
        likeLookup,
        commentLookup,
        viewsLookup,
        addFields,
        {
          '$match': {
            'blogUser.doesFollow': true
          }
        },
        sortingStage,
        projectStage
      ];
    }

    if (topics) {
      const topicsArray = topics.split(',');
      pipeline.unshift({
        '$match': {
          'topics': {
            '$in': topicsArray
          }
        }
      })
    }

    if (title) {
      pipeline.unshift({
        '$addFields': {
          'matched': {
            '$regexMatch': {
              'input': '$title',
              'regex': new RegExp(`^${title}`),
              'options': 'i'
            }
          }
        }
      }, {
        '$match': {
          'matched': true
        }
      })
    }

    const blogs = await blogModel.aggregate(pipeline);

    res
      .status(200)
      .json(new ApiResponse(
        200,
        blogs,
        "All blogs fetched successfully"
      ))

  } catch (e) {
    console.log(e);
  }
}

const getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.aggregate([
      {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$project': {
                'name': 1,
                'username': 1,
                'profilePic': 1
              }
            }
          ],
          'as': 'userDetails'
        }
      }, {
        '$addFields': {
          'blogUser': {
            '$first': '$userDetails'
          }
        }
      }, {
        '$lookup': {
          'from': 'likes',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'likedBy'
        }
      }, {
        '$lookup': {
          'from': 'comments',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'commentBy'
        }
      }, {
        '$lookup': {
          'from': 'views',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'viewedBy'
        }
      }, {
        '$addFields': {
          'totalLikes': {
            '$size': '$likedBy'
          },
          'totalComments': {
            '$size': '$commentBy'
          },
          'totalViews': {
            '$size': '$viewedBy'
          }
        }
      },
      {
        '$sort': {
          'createdAt': -1
        }
      },
      {
        '$project': {
          'title': 1,
          'description': 1,
          'totalLikes': 1,
          'totalComments': 1,
          'totalViews': 1,
          'frontImage': 1,
          'blogUser': 1,
          'createdAt': 1,
          'topics': 1
        }
      }
    ])
    res
      .status(200)
      .json(new ApiResponse(
        200,
        blogs,
        "All blogs fetched successfully"
      ))
  } catch (e) {
    console.log(e);
  }
}

const getOnlyFollowingBlogsController = async (req, res) => {
  try {
    const { blogId } = req.query;

    if (!blogId) {
      return res
        .status(400)
        .json(new ApiError(
          400,
          "No Blog Id"
        ))
    }

    const blogs = await blogModel.aggregate([
      {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$project': {
                'name': 1,
                'username': 1,
                'profilePic': 1,
                'followers': 1,
                'doesFollow': {
                  '$in': [
                    new mongoose.Types.ObjectId(`${blogId}`), '$followers'
                  ]
                }
              }
            }
          ],
          'as': 'userDetails'
        }
      }, {
        '$addFields': {
          'blogUser': {
            '$first': '$userDetails'
          }
        }
      },
      {
        '$match': {
          'blogUser.doesFollow': true
        }
      },
      {
        '$lookup': {
          'from': 'likes',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'likedBy'
        }
      }, {
        '$lookup': {
          'from': 'comments',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'commentBy'
        }
      }, {
        '$lookup': {
          'from': 'views',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'viewedBy'
        }
      }, {
        '$addFields': {
          'totalLikes': {
            '$size': '$likedBy'
          },
          'totalComments': {
            '$size': '$commentBy'
          },
          'totalViews': {
            '$size': '$viewedBy'
          }
        }
      }, {
        '$project': {
          'title': 1,
          'description': 1,
          'totalLikes': 1,
          'totalComments': 1,
          'totalViews': 1,
          'frontImage': 1,
          'blogUser': 1,
          'topics': 1,
          'createdAt': 1
        }
      },
      {
        '$sort': {
          'createdAt': -1
        }
      }
    ])

    res
      .status(200)
      .json(new ApiResponse(
        200,
        blogs,
        "All blogs fetched successfully"
      ))

  } catch (e) {
    console.log(e);
  }
}

const addBlogController = async (req, res) => {
  try {

    const { title, content, topics, description } = req.body;

    if (!title || !content || !topics) {
      res
        .status(400)
        .json(new ApiError(
          400,
          "Title and content and topics is required"
        ))
      return;
    }

    const frontImageLocalPath = req.file?.path;
    let cloudinaryUrl = "";

    if (frontImageLocalPath) {
      cloudinaryUrl = await uploadToCloudinary(frontImageLocalPath);
    }

    const newblog = await blogModel.create({
      title,
      content,
      user: req.user._id,
      topics,
      description,
      frontImage: cloudinaryUrl
    });

    const blog = await newblog.save();

    res
      .status(200)
      .json(new ApiResponse(
        200,
        blog,
        "Blog added successfully"
      ));

  } catch (e) {
    console.log(e);
  }
}

const getBlogsByUserNameController = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username });

    if (!user) {
      res
        .status(400)
        .json(new ApiError(
          400,
          "No user found"
        ));
      return;
    }

    const blogs = await blogModel.find({ user: user._id });

    res
      .status(200)
      .json(new ApiResponse(
        200,
        blogs,
        "Blogs fetched successfully"
      ));

  } catch (e) {
    console.log(e);
  }

}

const searchBlogsController = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title || title == "") {
      res
        .status(200)
      return;
    }

    const blogs = await blogModel.aggregate([
      {
        '$addFields': {
          'matched': {
            '$regexMatch': {
              'input': '$title',
              'regex': new RegExp(`^${title}`),
              'options': 'i'
            }
          }
        }
      }, {
        '$match': {
          'matched': true
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$project': {
                'name': 1,
                'username': 1,
                'profilePic': 1,
                'followers': 1
              }
            }
          ],
          'as': 'userDetails'
        }
      }, {
        '$addFields': {
          'blogUser': {
            '$first': '$userDetails'
          }
        }
      }, {
        '$lookup': {
          'from': 'likes',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'likedBy'
        }
      }, {
        '$lookup': {
          'from': 'comments',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'commentBy'
        }
      }, {
        '$lookup': {
          'from': 'views',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'viewedBy'
        }
      }, {
        '$addFields': {
          'totalLikes': {
            '$size': '$likedBy'
          },
          'totalComments': {
            '$size': '$commentBy'
          },
          'totalViews': {
            '$size': '$viewedBy'
          }
        }
      }, {
        '$project': {
          'title': 1,
          'description': 1,
          'totalLikes': 1,
          'totalComments': 1,
          'totalViews': 1,
          'frontImage': 1,
          'blogUser': 1,
          'topics': 1,
          'createdAt': 1
        }
      },
      {
        '$sort': {
          'createdAt': -1
        }
      }
    ])

    res
      .status(200)
      .json(new ApiResponse(
        200,
        blogs,
        "Blogs fetched successfully"
      ))

  } catch (e) {
    console.log(e);
  }
}

const searchByTopicsController = async (req, res) => {
  try {
    const { topics } = req.query;
    if (!topics) {
      return res
        .status(400)
        .json(new ApiError(
          400,
          "No Topics"
        ));
    }
    const topicsArray = topics.split(',');
    const blogs = await blogModel.aggregate([
      {
        '$match': {
          'topics': {
            '$in': topicsArray
          }
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$project': {
                'name': 1,
                'username': 1,
                'profilePic': 1,
                'followers': 1
              }
            }
          ],
          'as': 'userDetails'
        }
      }, {
        '$addFields': {
          'blogUser': {
            '$first': '$userDetails'
          }
        }
      }, {
        '$lookup': {
          'from': 'likes',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'likedBy'
        }
      }, {
        '$lookup': {
          'from': 'comments',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'commentBy'
        }
      }, {
        '$lookup': {
          'from': 'views',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'viewedBy'
        }
      }, {
        '$addFields': {
          'totalLikes': {
            '$size': '$likedBy'
          },
          'totalComments': {
            '$size': '$commentBy'
          },
          'totalViews': {
            '$size': '$viewedBy'
          }
        }
      }, {
        '$project': {
          'title': 1,
          'description': 1,
          'totalLikes': 1,
          'totalComments': 1,
          'totalViews': 1,
          'frontImage': 1,
          'blogUser': 1,
          'topics': 1,
          'createdAt': 1
        }
      },
      {
        '$sort': {
          'createdAt': -1
        }
      }
    ])

    res
      .status(200)
      .json(new ApiResponse(
        200,
        blogs,
        "Fetched!"
      ))
  } catch (e) {
    console.log(e);
  }
}

const deleteBlogController = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blogToBeDeleted = await blogModel.findOne({ _id: blogId });

    if (!blogToBeDeleted) {
      res
        .status(400)
        .json(new ApiError(
          400,
          "No blog found"
        ));
      return;
    }

    const user = await userModel.findById(req.user._id).select("-password");

    if (!user.blogs.includes(blogId)) {
      res
        .status(400)
        .json(new ApiError(
          400,
          "Not authorized to delete"
        ));
      return;
    }

    user.blogs.splice(user.blogs.indexOf(blogId), 1);
    await user.save({ validateBeforeSave: false });

    await blogToBeDeleted.deleteOne()

    res
      .status(200)
      .json(new ApiResponse(
        200,
        {},
        "Blog deleted successfully"
      ))
  } catch (e) {
    console.log(e);
  }
}

const likeBlogController = async (req, res) => {
  try {

    const { blogId } = req.params;
    let toggled = false;

    if (!blogId) {
      res
        .status(400)
        .json(new ApiError(
          400,
          "No blog found"
        ));
      return;
    }

    const isLiked = await likeModel.findOne({ user: req.user._id, blog: blogId });

    if (isLiked) {
      await isLiked.deleteOne();
      toggled = false;
    } else {
      const like = await likeModel.create({ user: req.user._id, blog: blogId });
      await like.save();
      toggled = true;
    }

    res
      .status(200)
      .json(new ApiResponse(
        200,
        toggled,
        'Done'
      ))
  } catch (e) {
    console.log(e);
  }
}

const getBlogByBlogIdController = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) {
      return res.status(400).json(new ApiError(400, "No Blog ID given"))
    }
    // const blog = await blogModel.findById(blogId)
    const blog = await blogModel.aggregate([
      {
        '$match': {
          '_id': new mongoose.Types.ObjectId(`${blogId}`)
        }
      },
      {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$project': {
                'username': 1,
                'name': 1,
                'profilePic': 1
              }
            }
          ],
          'as': 'userDetails'
        }
      }, {
        '$lookup': {
          'from': 'likes',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'likes'
        }
      }, {
        '$lookup': {
          'from': 'comments',
          'localField': '_id',
          'foreignField': 'blog',
          'as': 'comments'
        }
      }, {
        '$lookup': {
          'from': 'views',
          'localField': 'user',
          'foreignField': '_id',
          'as': 'views'
        }
      }, {
        '$addFields': {
          'blogUser': {
            '$first': '$userDetails'
          },
          'totalComments': {
            '$size': '$comments'
          }
        }
      }, {
        '$project': {
          'title': 1,
          'content': 1,
          'description': 1,
          'createdAt': 1,
          'topics': 1,
          'frontImage': 1,
          'blogUser': 1,
          'likes': 1,
          'totalComments': 1,
          'views': 1
        }
      }
    ])
    res
      .status(200)
      .json(new ApiResponse(
        200,
        blog[0],
        "Blog fetched successfully"
      ))
  } catch (e) {
    console.log(e);
  }
}

const getUsersWhoLiked = async (req, res) => {
  try {
    const { blogId } = req.query;
    const likes = await likeModel.aggregate([
      {
        '$match': {
          'blog': new mongoose.Types.ObjectId(`${blogId}`)
        }
      }, {
        '$lookup': {
          'from': 'users',
          'localField': 'user',
          'foreignField': '_id',
          'pipeline': [
            {
              '$project': {
                'username': 1,
                'name': 1,
                'profilePic': 1
              }
            }
          ],
          'as': 'likedUser'
        }
      }, {
        '$addFields': {
          'likedUser': {
            '$first': '$likedUser'
          }
        }
      }
    ]);

    res
      .status(200)
      .json(new ApiResponse(
        200,
        likes,
        "Done"
      ))
  } catch (e) {
    console.log(e);
  }
}

const isLiked = async (req, res) => {
  try {
    const { userId, blogId } = req.query;
    const likedColl = await likeModel.findOne({ user: userId, blog: blogId });

    res
      .status(200)
      .json(new ApiResponse(
        200,
        likedColl,
        "Done"
      ));

  } catch (e) {
    console.log(e);
  }
}

const markViewed = async (req, res) => {
  try {
    const { userId, blogId } = req.query;

    if (!userId && !blogId) {
      return res
        .status(200)
        .json(new ApiError(
          400,
          "No Credentials"
        ));
    }

    const isViewed = await viewsModel.findOne({ user: userId, blog: blogId });
    if (!isViewed) {
      const newView = await viewsModel.create({ user: userId, blog: blogId });
      await newView.save();
    }

    //adding it to history
    const user = await userModel.findById(req.user._id);
    if (user.history.length == 10) {
      user.history.pop();
      user.history.unshift(blogId);
    } else {
      user.history.unshift(blogId);
    }

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(
        200,
        {},
        "Done"
      ))

  } catch (e) {
    console.log(e);
  }
}

const toggleBookmarkBlog = async (req, res) => {
  try {
    const { blogId } = req.query;
    if (!blogId) {
      return res
        .status(400)
        .json(new ApiError(
          400,
          "No Blog ID"
        ))
    }

    const user = await userModel.findById(req.user._id);
    if (user.bookmarks.includes(blogId)) {
      user.bookmarks.splice(user.bookmarks.indexOf(blogId), 1);
    } else {
      user.bookmarks.unshift(blogId);
    }
    await user.save({ validateBeforeSave: false });

    res
    .status(200)
    .json(new ApiResponse(
      200,
      {},
      "Toggled"
    ))

  } catch (e) {
    console.log(e);
  }
}

const getBookmarksController = async (req, res) => {
  try {
    const blogs = await userModel.aggregate([
      {
        '$match': {
          '_id': req.user._id
        }
      }, {
        '$lookup': {
          'from': 'blogs', 
          'localField': 'bookmarks', 
          'foreignField': '_id', 
          'as': 'bookmarkedBlog', 
          'pipeline': [
            {
              '$lookup': {
                'from': 'users', 
                'localField': 'user', 
                'foreignField': '_id', 
                'pipeline': [
                  {
                    '$project': {
                      'name': 1, 
                      'username': 1, 
                      'profilePic': 1, 
                      'followers': 1
                    }
                  }
                ], 
                'as': 'userDetails'
              }
            }, {
              '$addFields': {
                'blogUser': {
                  '$first': '$userDetails'
                }
              }
            }, {
              '$lookup': {
                'from': 'likes', 
                'localField': '_id', 
                'foreignField': 'blog', 
                'as': 'likedBy'
              }
            }, {
              '$lookup': {
                'from': 'comments', 
                'localField': '_id', 
                'foreignField': 'blog', 
                'as': 'commentBy'
              }
            }, {
              '$lookup': {
                'from': 'views', 
                'localField': '_id', 
                'foreignField': 'blog', 
                'as': 'viewedBy'
              }
            }, {
              '$addFields': {
                'totalLikes': {
                  '$size': '$likedBy'
                }, 
                'totalComments': {
                  '$size': '$commentBy'
                }, 
                'totalViews': {
                  '$size': '$viewedBy'
                }
              }
            }, {
              '$project': {
                'title': 1, 
                'description': 1, 
                'totalLikes': 1, 
                'totalComments': 1, 
                'totalViews': 1, 
                'frontImage': 1, 
                'blogUser': 1,
                'topics': 1,
                'createdAt': 1
              }
            },
            {
              '$sort': {
                'createdAt': -1
              }
            }
          ]
        }
      }, {
        '$project': {
          'bookmarkedBlog': 1
        }
      }
    ]);

    res
    .status(200)
    .json(new ApiResponse(
      200,
      blogs,
      "Fetched!"
    ))
  } catch (e) {
    console.log(e);
  }
}

const getHistoryController = async (req, res) => {
  try {
    const blogs = await userModel.aggregate([
      {
        '$match': {
          '_id': req.user._id
        }
      }, {
        '$lookup': {
          'from': 'blogs', 
          'localField': 'history', 
          'foreignField': '_id', 
          'as': 'historyBlog', 
          'pipeline': [
            {
              '$lookup': {
                'from': 'users', 
                'localField': 'user', 
                'foreignField': '_id', 
                'pipeline': [
                  {
                    '$project': {
                      'name': 1, 
                      'username': 1, 
                      'profilePic': 1, 
                      'followers': 1
                    }
                  }
                ], 
                'as': 'userDetails'
              }
            }, {
              '$addFields': {
                'blogUser': {
                  '$first': '$userDetails'
                }
              }
            }, {
              '$lookup': {
                'from': 'likes', 
                'localField': '_id', 
                'foreignField': 'blog', 
                'as': 'likedBy'
              }
            }, {
              '$lookup': {
                'from': 'comments', 
                'localField': '_id', 
                'foreignField': 'blog', 
                'as': 'commentBy'
              }
            }, {
              '$lookup': {
                'from': 'views', 
                'localField': '_id', 
                'foreignField': 'blog', 
                'as': 'viewedBy'
              }
            }, {
              '$addFields': {
                'totalLikes': {
                  '$size': '$likedBy'
                }, 
                'totalComments': {
                  '$size': '$commentBy'
                }, 
                'totalViews': {
                  '$size': '$viewedBy'
                }
              }
            }, {
              '$project': {
                'title': 1, 
                'description': 1, 
                'totalLikes': 1, 
                'totalComments': 1, 
                'totalViews': 1, 
                'frontImage': 1, 
                'blogUser': 1,
                'topics': 1,
                'createdAt': 1
              }
            }
          ]
        }
      }, {
        '$project': {
          'historyBlog': 1
        }
      }
    ]);

    res
    .status(200)
    .json(new ApiResponse(
      200,
      blogs,
      "Fetched!"
    ))
  } catch (e) {
    console.log(e);
  }
}

export {
  getAllBlogsController,
  addBlogController,
  getBlogsByUserNameController,
  searchBlogsController,
  deleteBlogController,
  likeBlogController,
  getBlogByBlogIdController,
  isLiked,
  markViewed,
  getUsersWhoLiked,
  getOnlyFollowingBlogsController,
  searchByTopicsController,
  getBlogsController,
  toggleBookmarkBlog,
  getBookmarksController,
  getHistoryController
}
