package com.divinelight.bibleapp.controller;

import com.divinelight.bibleapp.dto.BibleNoteRequest;
import com.divinelight.bibleapp.dto.SavedVerseRequest;
import com.divinelight.bibleapp.entity.User;
import com.divinelight.bibleapp.service.BibleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bible")
public class BibleController {
    private final BibleService bibleService;

    public BibleController(BibleService bibleService) {
        this.bibleService = bibleService;
    }

    @GetMapping("/verse-of-day")
    public ResponseEntity<?> verseOfDay(
            Authentication authentication,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String version
    ) {
        return ResponseEntity.ok(bibleService.verseOfDay((User) authentication.getPrincipal(), language, version));
    }

    @GetMapping("/saved-verses")
    public ResponseEntity<?> savedVerses(Authentication authentication) {
        return ResponseEntity.ok(bibleService.savedVerses((User) authentication.getPrincipal()));
    }

    @PostMapping("/saved-verses")
    public ResponseEntity<?> saveVerse(Authentication authentication, @RequestBody SavedVerseRequest request) {
        return ResponseEntity.ok(bibleService.saveVerse((User) authentication.getPrincipal(), request));
    }

    @DeleteMapping("/saved-verses/{id}")
    public ResponseEntity<?> deleteSaved(Authentication authentication, @PathVariable String id) {
        bibleService.deleteSavedVerse((User) authentication.getPrincipal(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notes")
    public ResponseEntity<?> notes(Authentication authentication) {
        return ResponseEntity.ok(bibleService.notes((User) authentication.getPrincipal()));
    }

    @PostMapping("/notes")
    public ResponseEntity<?> saveNote(Authentication authentication, @RequestBody BibleNoteRequest request) {
        return ResponseEntity.ok(bibleService.saveNote((User) authentication.getPrincipal(), request));
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<?> updateNote(Authentication authentication, @PathVariable Long id, @RequestBody BibleNoteRequest request) {
        return ResponseEntity.ok(bibleService.updateNote((User) authentication.getPrincipal(), id, request));
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<?> deleteNote(Authentication authentication, @PathVariable String id) {
        bibleService.deleteNote((User) authentication.getPrincipal(), id);
        return ResponseEntity.ok().build();
    }
}
