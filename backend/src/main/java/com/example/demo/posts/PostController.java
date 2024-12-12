package com.example.demo.posts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
@CrossOrigin
public class PostController {
    @Autowired
    private PostService postService;

    @PostMapping("/add")
    public ResponseEntity<Post> addPost(@RequestBody Map<String, String> request) {
        String content = request.get("post");
        String username = request.get("username");
        Double latitude = Double.parseDouble(request.get("latitude"));
        Double longitude = Double.parseDouble(request.get("longitude"));
        
        Post newPost = postService.addPost(content, username, latitude, longitude);
        return ResponseEntity.ok(newPost);
    }
    
    @GetMapping("/getWithinRadius")
    public ResponseEntity<List<Post>> getPostsWithinRadius(@RequestParam("latitude") Double latitude,
                                                           @RequestParam("longitude") Double longitude,
                                                           @RequestParam("radius") Double radius) {
        List<Post> posts = postService.getPostsWithinRadius(latitude, longitude, radius);
        return ResponseEntity.ok(posts);
    }

   
    
    @GetMapping("/getAll")
    public ResponseEntity<List<Post>> getAllPosts(@RequestParam("username") String username) {
        List<Post> posts = postService.getAllPosts(username);
        return ResponseEntity.ok(posts);
    }

    
    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> likePost(@PathVariable("postId") Integer postId, @RequestBody Map<String, String> request) {
        String username = request.get("username");
        postService.likePost(postId, username);
        Post updatedPost = postService.getPostById(postId, username);
        return ResponseEntity.ok(updatedPost);
    }

    @PostMapping("/{postId}/dislike")
    public ResponseEntity<Post> dislikePost(@PathVariable("postId") Integer postId, @RequestBody Map<String, String> request) {
        String username = request.get("username");
        postService.dislikePost(postId, username);
        Post updatedPost = postService.getPostById(postId, username);
        return ResponseEntity.ok(updatedPost);
    }
}


