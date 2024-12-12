import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Button, TextField, Card, CardHeader, CardContent, CardActions, Avatar, Typography } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import './Main.css';


const Main = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      //show the posts inside the 10km radius
      fetch(`http://localhost:8080/posts/getWithinRadius?latitude=${latitude}&longitude=${longitude}&radius=10`)
        .then(res => res.json())
        .then(data => {
          const formattedPosts = data.map(post => ({
            ...post,
            formattedCreatedAt: formatTimestamp(post.createdAt),
            showComments: false,
            comments: post.comments.map(comment => ({
              ...comment,
              formattedCreatedAt: formatTimestamp(comment.createdAt)
            }))
          })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
          setPosts(formattedPosts);
        })
        .catch(error => console.error("Error fetching posts:", error));
    }, error => {
      console.error("Error getting location:", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);



  //format the time
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    const formattedTime = `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    return `${formattedDate} - ${formattedTime}`;
  };

  const padZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  //add post
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      fetch("http://localhost:8080/posts/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: newPostContent, username, latitude, longitude })
      })
        .then(res => res.json())
        .then(data => {
          setPosts([{ ...data, formattedCreatedAt: formatTimestamp(data.createdAt), showComments: false, comments: [] }, ...posts]);
          setNewPostContent('');
        })
        .catch(error => console.error("Error adding new post:", error));
    });
};


  //add comment under a post
  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (!newCommentContent.trim()) {
      alert("Comment content cannot be empty");
      return;
    }

    fetch("http://localhost:8080/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content: newCommentContent, username })
    })
      .then(res => res.json())
      .then(newComment => {
        setPosts(posts.map(post =>
          post.postId === postId
            ? { ...post, comments: [{ ...newComment, formattedCreatedAt: formatTimestamp(newComment.createdAt) }, ...post.comments] }
            : post
        ));
        setNewCommentContent('');
      })
      .catch(error => console.error("Error adding new comment:", error));
  };

  const toggleComments = (postId) => {
    const post = posts.find(post => post.postId === postId);
  
    // If comments are not shown and they haven't been fetched yet, fetch them
    if (!post.showComments && post.comments.length === 0) {
      fetch(`http://localhost:8080/comments/getByPost/${postId}?username=${username}`)
        .then(res => res.json())
        .then(comments => {
          const formattedComments = comments.map(comment => ({
            ...comment,
            formattedCreatedAt: formatTimestamp(comment.createdAt)
          })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
          setPosts(posts.map(p => p.postId === postId ? { ...p, comments: formattedComments, showComments: true } : p));
        })
        .catch(error => console.error("Error fetching comments:", error));
    } else {
      // Toggle the visibility of the comments
      setPosts(posts.map(p => p.postId === postId ? { ...p, showComments: !p.showComments } : p));
    }
  };
  
  //like function
  const handleLike = (postId) => {
    fetch(`http://localhost:8080/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(updatedPost => {
        console.log("Updated post after like:", updatedPost); 
        setPosts(posts.map(post =>
          post.postId === postId
            ? {
              ...updatedPost,
              userReaction: updatedPost.userReaction, 
              formattedCreatedAt: formatTimestamp(updatedPost.createdAt),
              showComments: post.showComments,
              comments: post.comments
            }
            : post
        ));
      })
      .catch(error => console.error("Error liking post:", error));
  };

  //dislike function
  const handleDislike = (postId) => {
    fetch(`http://localhost:8080/posts/${postId}/dislike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(updatedPost => {
        console.log("Updated post after dislike:", updatedPost); 
        setPosts(posts.map(post =>
          post.postId === postId
            ? {
              ...updatedPost,
              userReaction: updatedPost.userReaction, 
              formattedCreatedAt: formatTimestamp(updatedPost.createdAt),
              showComments: post.showComments,
              comments: post.comments
            }
            : post
        ));
      })
      .catch(error => console.error("Error disliking post:", error));
  };

  //comment likes function
  const handleCommentLike = (commentId, postId) => {
    fetch(`http://localhost:8080/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(updatedComment => {
        setPosts(posts.map(post =>
          post.postId === postId
            ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.commentId === commentId
                  ? { ...updatedComment, formattedCreatedAt: formatTimestamp(updatedComment.createdAt) }
                  : comment
              )
            }
            : post
        ));
      })
      .catch(error => console.error("Error liking comment:", error));
  };

  //comment dislike function
  const handleCommentDislike = (commentId, postId) => {
    fetch(`http://localhost:8080/comments/${commentId}/dislike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
      .then(res => res.json())
      .then(updatedComment => {
        setPosts(posts.map(post =>
          post.postId === postId
            ? {
              ...post,
              comments: post.comments.map(comment =>
                comment.commentId === commentId
                  ? { ...updatedComment, formattedCreatedAt: formatTimestamp(updatedComment.createdAt) }
                  : comment
              )
            }
            : post
        ));
      })
      .catch(error => console.error("Error disliking comment:", error));
  };

  return (
    <div className="main-container" style={{ marginTop: '40px'}}>
      <h2>All Posts in the Radius of 10 km from your current Location</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <TextField
          label="What's on your mind?"
          multiline
          rows={3}
          variant="outlined"
          fullWidth
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
        <Button classname="postButton" type="submit" variant="contained" color="primary" style={{ marginTop: '10px', marginBottom: '25px', backgroundColor: '#020002' }}>Post</Button>
      </form>
      <div className="post-list">
        {posts.map(post => (
          <Card key={post.postId} className="post-card">
            <CardHeader
              avatar={<Avatar>{post.username.charAt(0).toUpperCase()}</Avatar>}
              title={post.username}
              subheader={post.formattedCreatedAt}
            />
            <CardContent>
              <Typography variant="body1">{post.content}</Typography>
            </CardContent>
            <CardActions className="post-actions">
              <IconButton onClick={() => handleLike(post.postId)}>
                <ThumbUp color={post.userReaction === 'like' ? 'primary' : 'default'} />
              </IconButton>
              <Typography variant="body2">{post.likes}</Typography>
              <IconButton onClick={() => handleDislike(post.postId)}>
                <ThumbDown color={post.userReaction === 'dislike' ? 'primary' : 'default'} />
              </IconButton>
              <Typography variant="body2">{post.dislikes}</Typography>
              <Button 
                onClick={() => toggleComments(post.postId)}
                style={{ color: '#641088' }}
              >
                {post.showComments ? 'Hide Comments' : 'Show Comments'}
              </Button>
            </CardActions>
            {post.showComments && (
              <div className="comments-section">
                <form onSubmit={(e) => handleCommentSubmit(e, post.postId)} className="comment-form">
                  <TextField
                    label="Add a comment"
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                  />
                  <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px', marginBottom: '10px' }}>Comment</Button>
                </form>
                {post.comments.map(comment => (
                  <Card key={comment.commentId} className="comment-card">
                    <CardHeader
                      avatar={<Avatar>{comment.username.charAt(0).toUpperCase()}</Avatar>}
                      title={comment.username}
                      subheader={comment.formattedCreatedAt}
                    />
                    <CardContent>
                      <Typography variant="body2">{comment.content}</Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => handleCommentLike(comment.commentId, post.postId)}>
                        <ThumbUp color={comment.userReaction === 'like' ? 'primary' : 'default'} />
                      </IconButton>
                      <Typography variant="body2">{comment.likes}</Typography>
                      <IconButton onClick={() => handleCommentDislike(comment.commentId, post.postId)}>
                        <ThumbDown color={comment.userReaction === 'dislike' ? 'primary' : 'default'} />
                      </IconButton>
                      <Typography variant="body2">{comment.dislikes}</Typography>
                    </CardActions>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Main;

