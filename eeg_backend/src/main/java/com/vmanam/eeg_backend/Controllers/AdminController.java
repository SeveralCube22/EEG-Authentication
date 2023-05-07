package com.vmanam.eeg_backend.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @PostMapping("/checkadmin")
    String logIn(@RequestParam("userName") String userName, @RequestParam("pass") String pass) {
        return userName + "hello";
    }
}
