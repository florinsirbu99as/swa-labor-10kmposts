package com.example.demo.posts;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserReactionRepository extends JpaRepository<UserReaction, Integer> {
    Optional<UserReaction> findByPostAndUsername(Post post, String username);
    long countByPostAndReactionType(Post post, String reactionType);
}