package com.divinelight.bibleapp.controller;

import com.divinelight.bibleapp.entity.User;
import com.divinelight.bibleapp.service.MatrimonyService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/matrimony")
public class MatrimonyController {
    private final MatrimonyService matrimonyService;
    public MatrimonyController(MatrimonyService matrimonyService) { this.matrimonyService = matrimonyService; }

    @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createProfile(Authentication authentication,
                                           @RequestParam String name,
                                           @RequestParam String age,
                                           @RequestParam String gender,
                                           @RequestParam String location,
                                           @RequestParam(required = false) String denomination,
                                           @RequestParam String occupation,
                                           @RequestParam String education,
                                           @RequestParam(required = false) String familyDetails,
                                           @RequestParam(required = false) String bio,
                                           @RequestParam String phone,
                                           @RequestParam String email,
                                           @RequestPart(required = false) MultipartFile photo) {
        return ResponseEntity.ok(matrimonyService.createOrUpdate((User) authentication.getPrincipal(), name, age, gender, location, denomination, occupation, education, familyDetails != null ? familyDetails : bio, phone, email, photo));
    }

    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(Authentication authentication,
                                           @RequestParam String name,
                                           @RequestParam String age,
                                           @RequestParam String gender,
                                           @RequestParam String location,
                                           @RequestParam(required = false) String denomination,
                                           @RequestParam String occupation,
                                           @RequestParam String education,
                                           @RequestParam(required = false) String familyDetails,
                                           @RequestParam(required = false) String bio,
                                           @RequestParam String phone,
                                           @RequestParam String email,
                                           @RequestPart(required = false) MultipartFile photo) {
        return createProfile(authentication, name, age, gender, location, denomination, occupation, education, familyDetails, bio, phone, email, photo);
    }

    @GetMapping("/profile/me")
    public ResponseEntity<?> myProfile(Authentication authentication) {
        return ResponseEntity.ok(matrimonyService.myProfile((User) authentication.getPrincipal()));
    }

    @GetMapping("/profiles")
    public ResponseEntity<?> profiles(Authentication authentication) {
        return ResponseEntity.ok(matrimonyService.profiles((User) authentication.getPrincipal()));
    }

    @PostMapping("/interests/{profileId}/send")
    public ResponseEntity<?> send(Authentication authentication, @PathVariable Long profileId) {
        return ResponseEntity.ok(matrimonyService.sendInterest((User) authentication.getPrincipal(), profileId));
    }

    @PostMapping("/interests/users/{profileUserId}/accept")
    public ResponseEntity<?> acceptByUser(Authentication authentication, @PathVariable Long profileUserId) {
        return ResponseEntity.ok(matrimonyService.acceptByUserId((User) authentication.getPrincipal(), profileUserId));
    }

    @GetMapping("/interests/received")
    public ResponseEntity<?> received(Authentication authentication) {
        return ResponseEntity.ok(matrimonyService.received((User) authentication.getPrincipal()));
    }

    @GetMapping("/interests/sent")
    public ResponseEntity<?> sent(Authentication authentication) {
        return ResponseEntity.ok(matrimonyService.sent((User) authentication.getPrincipal()));
    }
}
