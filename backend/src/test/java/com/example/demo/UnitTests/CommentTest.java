package com.example.demo.UnitTests;

import com.example.demo.comment.*;
import com.example.demo.posts.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CommentTest {

    @Test
    public void testConstructorAndGetters() {
        // Create a Post instance
        Post post = new Post();
        post.setPostId(1);

        // Create a Comment instance
        Comment comment = new Comment("Test content", "TestUser", post);

        // Test constructor and getters
        assertEquals("Test content", comment.getContent());
        assertEquals("TestUser", comment.getUsername());
        assertEquals(post, comment.getPost());
    }

    @Test
    public void testSetters() {
        // Create a Post instance
        Post post = new Post();
        post.setPostId(1);

        // Create a Comment instance
        Comment comment = new Comment();

        // Test setters
        comment.setContent("Updated content");
        comment.setUsername("UpdatedUser");
        comment.setPost(post);

        assertEquals("Updated content", comment.getContent());
        assertEquals("UpdatedUser", comment.getUsername());
        assertEquals(post, comment.getPost());
    }
}
