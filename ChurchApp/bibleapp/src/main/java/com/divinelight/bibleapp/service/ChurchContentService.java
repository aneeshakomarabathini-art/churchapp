package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.ChurchContentResponse;
import com.divinelight.bibleapp.dto.YoutubeMetaResponse;
import com.divinelight.bibleapp.entity.*;
import com.divinelight.bibleapp.repository.ChurchContentRepository;
import com.divinelight.bibleapp.repository.ChurchRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ChurchContentService {
    private final ChurchRepository churchRepository;
    private final ChurchContentRepository contentRepository;
    private final FileStorageService fileStorageService;
    private final YoutubeService youtubeService;
    private final NotificationService notificationService;
    private final ResponseUrlService urlService;

    public ChurchContentService(ChurchRepository churchRepository, ChurchContentRepository contentRepository, FileStorageService fileStorageService, YoutubeService youtubeService, NotificationService notificationService, ResponseUrlService urlService) {
        this.churchRepository = churchRepository;
        this.contentRepository = contentRepository;
        this.fileStorageService = fileStorageService;
        this.youtubeService = youtubeService;
        this.notificationService = notificationService;
        this.urlService = urlService;
    }

    public ChurchContentResponse upload(User user, String type, String title, String description, String youtubeUrl, String thumbnailUrl, String eventDate, MultipartFile file, MultipartFile image) {
        Church church = churchRepository.findByAdminUser(user).orElseThrow(() -> new RuntimeException("Approved church not found for this account"));
        if (church.getStatus() != ChurchStatus.APPROVED) throw new RuntimeException("Your church is not approved yet");

        ContentType contentType = ContentType.valueOf((type == null ? "MESSAGE" : type).toUpperCase());
        String finalTitle = title == null ? "" : title.trim();
        String finalDescription = description == null ? "" : description.trim();
        String videoId = "";
        String finalThumb = thumbnailUrl == null ? "" : thumbnailUrl.trim();
        String cleanYoutube = youtubeUrl == null ? "" : youtubeUrl.trim();

        if (!cleanYoutube.isBlank()) {
            YoutubeMetaResponse meta = youtubeService.getMetadata(cleanYoutube);
            videoId = meta.getYoutubeVideoId();
            if (finalTitle.isBlank()) finalTitle = meta.getTitle();
            if (finalDescription.isBlank()) finalDescription = meta.getDescription();
            if (finalThumb.isBlank()) finalThumb = meta.getThumbnailUrl();
        }
        if (finalTitle.isBlank()) throw new RuntimeException("Title is required");
        if (finalDescription.isBlank()) throw new RuntimeException("Description is required");
        if (contentType == ContentType.EVENT && (eventDate == null || eventDate.trim().isBlank())) throw new RuntimeException("Event date is required");

        String filePath = fileStorageService.store(file, "church-content");
        String imagePath = fileStorageService.store(image, "church-images");
        if ((imagePath == null || imagePath.isBlank()) && file != null && file.getContentType() != null && file.getContentType().startsWith("image/")) {
            imagePath = filePath;
        }

        ChurchContent content = new ChurchContent();
        content.setChurch(church);
        content.setCreatedBy(user);
        content.setType(contentType);
        content.setTitle(finalTitle);
        content.setDescription(finalDescription);
        content.setYoutubeUrl(cleanYoutube);
        content.setYoutubeVideoId(videoId);
        content.setThumbnailUrl(finalThumb);
        content.setFilePath(filePath);
        content.setFileName(file == null ? "" : file.getOriginalFilename());
        content.setFileMimeType(file == null ? "" : file.getContentType());
        content.setImagePath(imagePath);
        content.setEventDate(eventDate == null ? "" : eventDate.trim());

        ChurchContent saved = contentRepository.save(content);
        notificationService.createForAllUsers(
                "New " + contentType.name().toLowerCase() + " from " + church.getChurchName(),
                finalTitle,
                "church_update",
                contentType == ContentType.EVENT ? "calendar-outline" : contentType == ContentType.SONG ? "musical-notes-outline" : "logo-youtube",
                contentType == ContentType.EVENT ? "#52B788" : contentType == ContentType.SONG ? "#6366F1" : "#E63946",
                "Church",
                String.valueOf(saved.getId())
        );
        return new ChurchContentResponse(saved, urlService.baseUrl());
    }

    public List<ChurchContentResponse> myContent(User user) {
        Church church = churchRepository.findByAdminUser(user).orElseThrow(() -> new RuntimeException("Church not found for this account"));
        String base = urlService.baseUrl();
        return contentRepository.findByChurchOrderByCreatedAtDesc(church).stream().map(c -> new ChurchContentResponse(c, base)).toList();
    }

    public void delete(User user, Long id) {
        ChurchContent content = contentRepository.findById(id).orElseThrow(() -> new RuntimeException("Content not found"));
        if (content.getCreatedBy() == null || !content.getCreatedBy().getId().equals(user.getId())) throw new RuntimeException("Content not found");
        contentRepository.delete(content);
    }
}
