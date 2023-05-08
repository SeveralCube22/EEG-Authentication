package com.vmanam.eeg_backend.Repositories;

import com.vmanam.eeg_backend.Entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUserId(int userId);
}
