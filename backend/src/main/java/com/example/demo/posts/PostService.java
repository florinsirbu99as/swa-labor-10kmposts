package com.example.demo.posts;

import com.example.demo.comment.*;

import java.util.List;



public interface PostService {
	public Post addPost(String content, String username, Double latitude, Double longitude);
    public List<Post> getAllPosts(String username);
    Comment addComment(Integer postId, String content, String username);
    List<Comment> getCommentsByPostId(Integer postId);
    void likePost(Integer postId, String username);
    void dislikePost(Integer postId, String username);
    public Post getPostById(Integer postId, String username);
    
    void likeComment(Integer commentId, String username);
    void dislikeComment(Integer commentId, String username);
    Comment getCommentById(Integer commentId);
    
    long getCommentLikes(Comment comment);
    long getCommentDislikes(Comment comment);
    String getCommentUserReaction(Comment comment, String username);
    void setCommentReactionCountsAndUserReaction(Comment comment, String username);
    
    public List<Post> getPostsWithinRadius(Double userLat, Double userLon, double radiusInKm);

    
}