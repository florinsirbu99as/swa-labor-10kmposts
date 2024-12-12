package com.example.demo.users;



public interface UserService {
    User saveUser(User user);
    boolean existsByUsername(String username);
    User findByUsername(String username);
}
