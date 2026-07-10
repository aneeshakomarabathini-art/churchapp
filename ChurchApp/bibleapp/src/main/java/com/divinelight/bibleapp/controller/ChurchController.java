package com.divinelight.bibleapp.controller;

import com.divinelight.bibleapp.service.ChurchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/churches")
public class ChurchController {
    private final ChurchService churchService;
    public ChurchController(ChurchService churchService) { this.churchService = churchService; }

    @GetMapping
    public ResponseEntity<?> churches() { return ResponseEntity.ok(churchService.approvedChurches()); }

    @GetMapping("/latest-content")
    public ResponseEntity<?> latestContent() { return ResponseEntity.ok(churchService.latestContent()); }

    @GetMapping("/{churchId}")
    public ResponseEntity<?> church(@PathVariable Long churchId) { return ResponseEntity.ok(churchService.church(churchId)); }

    @GetMapping("/{churchId}/content")
    public ResponseEntity<?> content(@PathVariable Long churchId, @RequestParam(required = false) String type) {
        return ResponseEntity.ok(churchService.content(churchId, type));
    }
}
