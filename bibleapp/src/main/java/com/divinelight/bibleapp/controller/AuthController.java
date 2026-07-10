// package com.divinelight.bibleapp.controller;

// import com.divinelight.bibleapp.dto.*;
// import com.divinelight.bibleapp.service.AuthService;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/auth")
// public class AuthController {
//     private final AuthService authService;
//     public AuthController(AuthService authService) { this.authService = authService; }

//     @GetMapping("/health")
//     public ResponseEntity<?> health() { return ResponseEntity.ok(Map.of("message", "Bible app backend is running")); }

//     @PostMapping("/register")
//     public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest request) { return ResponseEntity.ok(authService.registerUser(request)); }

//     @PostMapping(value = "/church-register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//     public ResponseEntity<AuthResponse> registerChurchAdmin(
//             @RequestParam String name,
//             @RequestParam String email,
//             @RequestParam String phone,
//             @RequestParam String password,
//             @RequestParam String churchName,
//             @RequestParam String churchLocation,
//             @RequestParam String churchAddress,
//             @RequestParam String churchPhone,
//             @RequestParam String churchEmail,
//             @RequestParam String churchTiming,
//             @RequestParam(required = false) String churchAbout,
//             @RequestPart("churchPhoto") MultipartFile churchPhoto
//     ) {
//         ChurchRegisterRequest request = new ChurchRegisterRequest();
//         request.setName(name);
//         request.setEmail(email);
//         request.setPhone(phone);
//         request.setPassword(password);
//         request.setChurchName(churchName);
//         request.setChurchLocation(churchLocation);
//         request.setChurchAddress(churchAddress);
//         request.setChurchPhone(churchPhone);
//         request.setChurchEmail(churchEmail);
//         request.setChurchTiming(churchTiming);
//         request.setChurchAbout(churchAbout);
//         return ResponseEntity.ok(authService.registerChurchAdmin(request, churchPhoto));
//     }

//     @PostMapping("/login")
//     public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) { return ResponseEntity.ok(authService.login(request)); }

//     @PostMapping("/admin-login")
//     public ResponseEntity<AuthResponse> adminLogin(@RequestBody LoginRequest request) { return ResponseEntity.ok(authService.adminLogin(request)); }

//     @GetMapping("/me")
//     public ResponseEntity<UserResponse> me(Authentication authentication) { return ResponseEntity.ok(authService.me(authentication.getName())); }
// }































package com.divinelight.bibleapp.controller;

import com.divinelight.bibleapp.dto.*;
import com.divinelight.bibleapp.service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @GetMapping("/health")
    public ResponseEntity<?> health() { return ResponseEntity.ok(Map.of("message", "Bible app backend is running")); }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody RegisterRequest request) { return ResponseEntity.ok(authService.registerUser(request)); }

    @PostMapping(value = "/church-register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AuthResponse> registerChurchAdmin(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String password,
            @RequestParam String churchName,
            @RequestParam String churchLocation,
            @RequestParam String churchAddress,
            @RequestParam String churchPhone,
            @RequestParam String churchEmail,
            @RequestParam String churchTiming,
            @RequestParam(required = false) String churchAbout,
            @RequestPart(value = "churchPhoto", required = false) MultipartFile churchPhoto
    ) {
        ChurchRegisterRequest request = new ChurchRegisterRequest();
        request.setName(name);
        request.setEmail(email);
        request.setPhone(phone);
        request.setPassword(password);
        request.setChurchName(churchName);
        request.setChurchLocation(churchLocation);
        request.setChurchAddress(churchAddress);
        request.setChurchPhone(churchPhone);
        request.setChurchEmail(churchEmail);
        request.setChurchTiming(churchTiming);
        request.setChurchAbout(churchAbout);
        return ResponseEntity.ok(authService.registerChurchAdmin(request, churchPhoto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) { return ResponseEntity.ok(authService.login(request)); }

    @PostMapping("/admin-login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody LoginRequest request) { return ResponseEntity.ok(authService.adminLogin(request)); }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) { return ResponseEntity.ok(authService.me(authentication.getName())); }
}