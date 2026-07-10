package com.divinelight.bibleapp.controller;

import com.divinelight.bibleapp.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    public AdminController(AdminService adminService) { this.adminService = adminService; }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() { return ResponseEntity.ok(adminService.dashboard()); }

    @GetMapping("/church-requests")
    public ResponseEntity<?> churchRequests() { return ResponseEntity.ok(adminService.churchRequests()); }

    @GetMapping("/users")
    public ResponseEntity<?> users() { return ResponseEntity.ok(adminService.allUsers()); }

    @GetMapping("/churches")
    public ResponseEntity<?> churches() { return ResponseEntity.ok(adminService.allChurches()); }

    @PutMapping("/churches/{churchId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long churchId) { return ResponseEntity.ok(adminService.approveChurch(churchId)); }

    @PutMapping("/churches/{churchId}/reject")
    public ResponseEntity<?> reject(@PathVariable Long churchId) { return ResponseEntity.ok(adminService.rejectChurch(churchId)); }
}
