package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.ChurchContent;

public class ChurchContentResponse {
    private Long id;
    private Long churchId;
    private String churchName;
    private String type;
    private String title;
    private String description;
    private String youtubeUrl;
    private String youtubeVideoId;
    private String thumbnailUrl;
    private String fileUri;
    private String fileName;
    private String fileMimeType;
    private String imageUri;
    private String eventDate;
    private String createdAt;
    private Long createdBy;

    public ChurchContentResponse(ChurchContent content, String baseUrl) {
        this.id = content.getId();
        this.churchId = content.getChurch() == null ? null : content.getChurch().getId();
        this.churchName = content.getChurch() == null ? null : content.getChurch().getChurchName();
        this.type = content.getType() == null ? null : content.getType().name().toLowerCase();
        this.title = content.getTitle();
        this.description = content.getDescription();
        this.youtubeUrl = content.getYoutubeUrl();
        this.youtubeVideoId = content.getYoutubeVideoId();
        this.thumbnailUrl = content.getThumbnailUrl();
        this.fileUri = toUrl(baseUrl, content.getFilePath());
        this.fileName = content.getFileName();
        this.fileMimeType = content.getFileMimeType();
        this.imageUri = toUrl(baseUrl, content.getImagePath());
        this.eventDate = content.getEventDate();
        this.createdAt = content.getCreatedAt() == null ? null : content.getCreatedAt().toString();
        this.createdBy = content.getCreatedBy() == null ? null : content.getCreatedBy().getId();
    }

    private String toUrl(String baseUrl, String path) {
        if (path == null || path.isBlank()) return "";
        if (path.startsWith("http")) return path;
        return baseUrl + path;
    }

    public Long getId() { return id; }
    public Long getChurchId() { return churchId; }
    public String getChurchName() { return churchName; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getYoutubeUrl() { return youtubeUrl; }
    public String getYoutubeVideoId() { return youtubeVideoId; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public String getFileUri() { return fileUri; }
    public String getFileName() { return fileName; }
    public String getFileMimeType() { return fileMimeType; }
    public String getImageUri() { return imageUri; }
    public String getEventDate() { return eventDate; }
    public String getCreatedAt() { return createdAt; }
    public Long getCreatedBy() { return createdBy; }
}
