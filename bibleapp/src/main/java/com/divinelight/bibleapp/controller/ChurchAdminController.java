package com.divinelight.bibleapp.controller;

import com.divinelight.bibleapp.dto.YoutubeMetaRequest;
import com.divinelight.bibleapp.entity.User;
import com.divinelight.bibleapp.service.ChurchContentService;
import com.divinelight.bibleapp.service.ChurchService;
import com.divinelight.bibleapp.service.YoutubeService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/church-admin")
public class ChurchAdminController {
    private final ChurchContentService contentService;
    private final ChurchService churchService;
    private final YoutubeService youtubeService;

    public ChurchAdminController(ChurchContentService contentService, ChurchService churchService, YoutubeService youtubeService) {
        this.contentService = contentService;
        this.churchService = churchService;
        this.youtubeService = youtubeService;
    }

    @GetMapping("/my-church")
    public ResponseEntity<?> myChurch(Authentication authentication) {
        return ResponseEntity.ok(churchService.myChurch((User) authentication.getPrincipal()));
    }

    @PutMapping(value = "/my-church", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMyChurch(
            Authentication authentication,
            @RequestParam(required = false) String churchName,
            @RequestParam(required = false) String churchLocation,
            @RequestParam(required = false) String churchAddress,
            @RequestParam(required = false) String churchPhone,
            @RequestParam(required = false) String churchEmail,
            @RequestParam(required = false) String churchTiming,
            @RequestParam(required = false) String churchAbout,
            @RequestPart(required = false) MultipartFile churchPhoto
    ) {
        return ResponseEntity.ok(churchService.updateMyChurch(
                (User) authentication.getPrincipal(),
                churchName,
                churchLocation,
                churchAddress,
                churchPhone,
                churchEmail,
                churchTiming,
                churchAbout,
                churchPhoto
        ));
    }

    @PostMapping(value = "/content", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(
            Authentication authentication,
            @RequestParam String type,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String youtubeUrl,
            @RequestParam(required = false) String thumbnailUrl,
            @RequestParam(required = false) String eventDate,
            @RequestPart(required = false) MultipartFile file,
            @RequestPart(required = false) MultipartFile image
    ) {
        return ResponseEntity.ok(contentService.upload((User) authentication.getPrincipal(), type, title, description, youtubeUrl, thumbnailUrl, eventDate, file, image));
    }

    @GetMapping("/my-content")
    public ResponseEntity<?> myContent(Authentication authentication) {
        return ResponseEntity.ok(contentService.myContent((User) authentication.getPrincipal()));
    }

    @DeleteMapping("/content/{contentId}")
    public ResponseEntity<?> delete(Authentication authentication, @PathVariable Long contentId) {
        contentService.delete((User) authentication.getPrincipal(), contentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/youtube-meta")
    public ResponseEntity<?> youtubeMeta(@RequestBody YoutubeMetaRequest request) {
        return ResponseEntity.ok(youtubeService.getMetadata(request.getYoutubeUrl()));
    }
}
