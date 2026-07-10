package com.divinelight.bibleapp.dto;

public class YoutubeMetaResponse {
    private String youtubeUrl;
    private String youtubeVideoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String authorName;
    public YoutubeMetaResponse(String youtubeUrl, String youtubeVideoId, String title, String description, String thumbnailUrl, String authorName) {
        this.youtubeUrl = youtubeUrl;
        this.youtubeVideoId = youtubeVideoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.authorName = authorName;
    }
    public String getYoutubeUrl() { return youtubeUrl; }
    public String getYoutubeVideoId() { return youtubeVideoId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public String getAuthorName() { return authorName; }
}
