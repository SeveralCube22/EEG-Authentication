package com.vmanam.eeg_backend.Controllers;

import com.vmanam.eeg_backend.Configurations.JwtTokenUtil;
import com.vmanam.eeg_backend.DTOs.JwtResponseDTO;
import com.vmanam.eeg_backend.DTOs.LoginRequestDTO;
import com.vmanam.eeg_backend.DTOs.UserCreateDTO;
import com.vmanam.eeg_backend.Entities.User;
import com.vmanam.eeg_backend.Repositories.UserRepository;
import com.vmanam.eeg_backend.Services.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private JwtUserDetailsService userDetailsService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/user")
    public ResponseEntity<Boolean> verifyUserExists(@RequestParam String email) {
        Optional<User> user = userRepository.findById(email);
        return new ResponseEntity<Boolean>(user.isPresent(), HttpStatus.OK);
    }

    @GetMapping("/isadmin")
    public boolean isAdmin() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getRoles().contains("ADMIN");
    }

    @GetMapping("/userinfo")
    public User getUser() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value="/user")
    public ResponseEntity<String> createNewUser(@RequestBody UserCreateDTO user)  {
        if(userRepository.existsById(user.getEmail()))
            return ResponseEntity.badRequest().body("User exists");

        User u = new User();
        u.setUserId(user.getUserId());
        u.setEmail(user.getEmail());
        u.setName(user.getName());
        u.setPassword(passwordEncoder.encode(user.getPassword()));
        u.setRoles(user.getRoles());

        userRepository.insert(u);
        return ResponseEntity.ok().body("Added user");
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginUser) throws AuthenticationException {

        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginUser.getEmail(),
                        loginUser.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtTokenUtil.generateToken(authentication);
        return ResponseEntity.ok(new JwtResponseDTO(token));
    }

    @PreAuthorize("hasRole('USER')")
    @RequestMapping(value="/userping", method = RequestMethod.GET)
    public String userPing(){
        return "Any User Can Read This";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @RequestMapping(value="/adminping", method = RequestMethod.GET)
    public String adminPing(){
        return "Only Admin can read this";
    }

}
