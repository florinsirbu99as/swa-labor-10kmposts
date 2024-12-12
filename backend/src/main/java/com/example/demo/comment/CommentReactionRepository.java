package com.example.demo.comment;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentReactionRepository extends JpaRepository<CommentReaction, Integer> {
    Optional<CommentReaction> findByCommentAndUsername(Comment comment, String username);
    long countByCommentAndReactionType(Comment comment, String reactionType);
}

