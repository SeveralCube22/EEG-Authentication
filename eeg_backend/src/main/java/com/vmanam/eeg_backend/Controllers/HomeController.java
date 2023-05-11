package com.vmanam.eeg_backend.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {
    @GetMapping("/")
    public String getRoot() {
        return "index.html";
    }

    @GetMapping("/admin")
    public String getAdmin() {return "forward:/";}

    @GetMapping("/adminpage")
    public String getAdminPage() {return "forward:/";}

    @GetMapping("/home")
    public String getHome() {return "forward:/";}

    @GetMapping("/confidence")
    public String getConfidence() {return "forward:/";}
}
