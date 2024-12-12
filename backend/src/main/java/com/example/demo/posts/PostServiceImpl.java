package com.example.demo.posts;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.comment.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserReactionRepository userReactionRepository;
    
    @Autowired
    private CommentReactionRepository commentReactionRepository;
    
    @Override
    public Post addPost(String content, String username, Double latitude, Double longitude) {
        Post post = new Post(content, username);
        post.setLatitude(latitude);
        post.setLongitude(longitude);
        post.setCreatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }
    public List<Post> getPostsWithinRadius(Double userLat, Double userLon, double radiusInKm) {
        List<Post> allPosts = postRepository.findAll();
        return allPosts.stream()
                       .filter(post -> distanceInKm(userLat, userLon, post.getLatitude(), post.getLongitude()) <= radiusInKm)
                       .collect(Collectors.toList());
    }

    private double distanceInKm(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the Earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // distance in km
    }


    
    @Override
    public List<Post> getAllPosts(String username) {
        List<Post> posts = postRepository.findAll();
        posts.forEach(post -> {
            post.setReactionCountsAndUserReaction(username);
            post.getComments().forEach(comment -> setCommentReactionCountsAndUserReaction(comment, username));
        });
        return posts;
    }

    @Override
    public Comment addComment(Integer postId, String content, String username) {
        Post post = postRepository.findById(postId)
                                   .orElseThrow(() -> new RuntimeException("Post not found"));
        Comment comment = new Comment(content, username, post);
        post.addComment(comment); 
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentRepository.findByPost_PostId(postId);
    }

    @Override
    public void likePost(Integer postId, String username) {
        handleReaction(postId, username, "like");
    }

    @Override
    public void dislikePost(Integer postId, String username) {
        handleReaction(postId, username, "dislike");
    }
    
    
    @Override
    public Post getPostById(Integer postId, String username) {
        Post post = postRepository.findById(postId)
                                 .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setReactionCountsAndUserReaction(username);
        post.getComments().forEach(comment -> setCommentReactionCountsAndUserReaction(comment, username));
        return post;
    }
    

    private void handleReaction(Integer postId, String username, String reactionType) {
        Post post = postRepository.findById(postId)
                                   .orElseThrow(() -> new RuntimeException("Post not found"));
        Optional<UserReaction> existingReaction = userReactionRepository.findByPostAndUsername(post, username);

        if (existingReaction.isPresent()) {
            UserReaction reaction = existingReaction.get();
            if (reaction.getReactionType().equals(reactionType)) {
                // Remove the reaction if it's the same
                userReactionRepository.delete(reaction);
                System.out.println("Removed reaction for user " + username + " on post " + postId);
            } else {
                // Update the reaction if it's different
                reaction.setReactionType(reactionType);
                userReactionRepository.save(reaction);
                System.out.println("Updated reaction for user " + username + " on post " + postId);
            }
        } else {
            // Add a new reaction
            UserReaction reaction = new UserReaction(post, username, reactionType);
            userReactionRepository.save(reaction);
            System.out.println("Added new reaction for user " + username + " on post " + postId);
        }
    }
    
    @Override
    public void likeComment(Integer commentId, String username) {
        handleCommentReaction(commentId, username, "like");
    }

    @Override
    public void dislikeComment(Integer commentId, String username) {
        handleCommentReaction(commentId, username, "dislike");
    }

    @Override
    public Comment getCommentById(Integer commentId) {
        return commentRepository.findById(commentId)
                                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    private void handleCommentReaction(Integer commentId, String username, String reactionType) {
        Comment comment = getCommentById(commentId);
        Optional<CommentReaction> existingReaction = commentReactionRepository.findByCommentAndUsername(comment, username);

        if (existingReaction.isPresent()) {
            CommentReaction reaction = existingReaction.get();
            if (reaction.getReactionType().equals(reactionType)) {
                // Remove the reaction if it's the same
                commentReactionRepository.delete(reaction);
            } else {
                // Update the reaction if it's different
                reaction.setReactionType(reactionType);
                commentReactionRepository.save(reaction);
            }
        } else {
            // Add a new reaction
            CommentReaction reaction = new CommentReaction(comment, username, reactionType);
            commentReactionRepository.save(reaction);
        }
    }
    @Override
    public long getCommentLikes(Comment comment) {
        return commentReactionRepository.countByCommentAndReactionType(comment, "like");
    }

    @Override
    public long getCommentDislikes(Comment comment) {
        return commentReactionRepository.countByCommentAndReactionType(comment, "dislike");
    }

    @Override
    public String getCommentUserReaction(Comment comment, String username) {
        return commentReactionRepository.findByCommentAndUsername(comment, username)
                                        .map(CommentReaction::getReactionType)
                                        .orElse(null);
    }

    @Override
    public void setCommentReactionCountsAndUserReaction(Comment comment, String username) {
        comment.setLikes(getCommentLikes(comment));
        comment.setDislikes(getCommentDislikes(comment));
        comment.setUserReaction(getCommentUserReaction(comment, username));
    }

}
