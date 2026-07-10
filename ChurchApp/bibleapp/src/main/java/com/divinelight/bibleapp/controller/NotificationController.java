package com.divinelight.bibleapp.controller;

import com.divinelight.bibleapp.entity.User;
import com.divinelight.bibleapp.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    public NotificationController(NotificationService notificationService) { this.notificationService = notificationService; }

    @GetMapping
    public ResponseEntity<?> notifications(Authentication authentication) { return ResponseEntity.ok(notificationService.myNotifications((User) authentication.getPrincipal())); }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> read(Authentication authentication, @PathVariable Long id) { return ResponseEntity.ok(notificationService.markRead((User) authentication.getPrincipal(), id)); }

    @PutMapping("/read-all")
    public ResponseEntity<?> readAll(Authentication authentication) { notificationService.markAllRead((User) authentication.getPrincipal()); return ResponseEntity.ok().build(); }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clear(Authentication authentication) { notificationService.clear((User) authentication.getPrincipal()); return ResponseEntity.ok().build(); }
}
