package com.example.demo.comment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.posts.PostService;

import java.util.List;
import java.util.Map;




@RestController
@RequestMapping("/comments")
@CrossOrigin
public class CommentController {

    @Autowired
    private PostService postService;

    @GetMapping("/getByPost/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable("postId") Integer postId, @RequestParam("username") String username) {
        List<Comment> comments = postService.getCommentsByPostId(postId);
        comments.forEach(comment -> postService.setCommentReactionCountsAndUserReaction(comment, username));
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/add")
    public ResponseEntity<Comment> addComment(@RequestBody Map<String, String> request) {
        Integer postId = Integer.parseInt(request.get("postId"));
        String content = request.get("content");
        String username = request.get("username");
        Comment newComment = postService.addComment(postId, content, username);
        return ResponseEntity.ok(newComment);
    }

    @PostMapping("/{commentId}/like")
    public ResponseEntity<Comment> likeComment(@PathVariable("commentId") Integer commentId, @RequestBody Map<String, String> request) {
        String username = request.get("username");
        postService.likeComment(commentId, username);
        Comment updatedComment = postService.getCommentById(commentId);
        postService.setCommentReactionCountsAndUserReaction(updatedComment, username);
        return ResponseEntity.ok(updatedComment);
    }

    @PostMapping("/{commentId}/dislike")
    public ResponseEntity<Comment> dislikeComment(@PathVariable("commentId") Integer commentId, @RequestBody Map<String, String> request) {
        String username = request.get("username");
        postService.dislikeComment(commentId, username);
        Comment updatedComment = postService.getCommentById(commentId);
        postService.setCommentReactionCountsAndUserReaction(updatedComment, username);
        return ResponseEntity.ok(updatedComment);
    }
}

