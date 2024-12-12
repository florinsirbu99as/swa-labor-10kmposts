package com.example.demo.UnitTests;


import org.junit.jupiter.api.Test;
import java.util.HashMap;
import java.util.Map;

public class CommentControllerTest {

    @Test
    public void testAddComment() {
        // Prepare request body
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("postId", "1");
        requestBody.put("content", "Test comment content");
        requestBody.put("username", "TestUser");


    }

    @Test
    public void testLikeComment() {
        // Prepare request body
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "TestUser");

    }

    @Test
    public void testDislikeComment() {
        // Prepare request body
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("username", "TestUser");


    }
}
