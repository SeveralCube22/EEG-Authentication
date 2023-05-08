package com.vmanam.eeg_backend.DTOs;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Data
public class UserCreateDTO {
    private String email;

    private String name;
    private String password;
    private int userId;
    private Set<String> roles;
}
