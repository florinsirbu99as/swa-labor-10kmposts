package com.example.demo.posts;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import com.example.demo.comment.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;


@Entity
@Table(name = "post")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;

    @Column(name = "post")
    private String content;

    @Column(name = "username")
    private String username;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserReaction> reactions = new ArrayList<>();

    @Transient
    private long likes;

    @Transient
    private long dislikes;

    @Transient
    private String userReaction;
    
    public Post() {
        // Default constructor
    }

    public Post(String content, String username) {
        this.content = content;
        this.username = username;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    
    
    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public void addComment(Comment comment) {
        comments.add(comment);
        comment.setPost(this);
    }

    public void removeComment(Comment comment) {
        comments.remove(comment);
        comment.setPost(null);
    }
    
    
    public long getLikes() {
        return reactions.stream().filter(r -> r.getReactionType().equals("like")).count();
    }

    public long getDislikes() {
        return reactions.stream().filter(r -> r.getReactionType().equals("dislike")).count();
    }

    public String getUserReaction(String username) {
        return reactions.stream()
                .filter(r -> r.getUsername().equals(username))
                .map(UserReaction::getReactionType)
                .findFirst()
                .orElse(null);
    }

    // Add a method to set transient fields
    public void setReactionCountsAndUserReaction(String username) {
        this.likes = getLikes();
        this.dislikes = getDislikes();
        this.userReaction = getUserReaction(username);
    }
}


