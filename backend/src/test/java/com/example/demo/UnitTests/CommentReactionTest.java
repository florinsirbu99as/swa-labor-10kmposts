package com.example.demo.UnitTests;

import com.example.demo.comment.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CommentReactionTest {

    @Test
    public void testConstructorAndGetters() {
        // Create a Comment instance
        Comment comment = new Comment();
        comment.setCommentId(1);
        comment.setContent("Test Comment");
        comment.setUsername("TestUser");

        // Create a CommentReaction instance
        CommentReaction commentReaction = new CommentReaction(comment, "TestUser", "like");

        // Test constructor and getters
        assertEquals(comment, commentReaction.getComment());
        assertEquals("TestUser", commentReaction.getUsername());
        assertEquals("like", commentReaction.getReactionType());
    }

    @Test
    public void testSetters() {
        // Create a Comment instance
        Comment comment = new Comment();
        comment.setCommentId(1);
        comment.setContent("Test Comment");
        comment.setUsername("TestUser");

        // Create a CommentReaction instance
        CommentReaction commentReaction = new CommentReaction();

        // Test setters
        commentReaction.setComment(comment);
        commentReaction.setUsername("UpdatedUser");
        commentReaction.setReactionType("dislike");

        assertEquals(comment, commentReaction.getComment());
        assertEquals("UpdatedUser", commentReaction.getUsername());
        assertEquals("dislike", commentReaction.getReactionType());
    }
}
