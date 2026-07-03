package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.Notification;

public class NotificationResponse {
    private Long id;
    private Long toUserId;
    private String title;
    private String message;
    private String type;
    private String icon;
    private String iconColor;
    private String screen;
    private String relatedId;
    private String readAt;
    private String createdAt;
    public NotificationResponse(Notification item) {
        this.id = item.getId();
        this.toUserId = item.getToUser() == null ? null : item.getToUser().getId();
        this.title = item.getTitle();
        this.message = item.getMessage();
        this.type = item.getType();
        this.icon = item.getIcon();
        this.iconColor = item.getIconColor();
        this.screen = item.getScreen();
        this.relatedId = item.getRelatedId();
        this.readAt = item.getReadAt() == null ? "" : item.getReadAt().toString();
        this.createdAt = item.getCreatedAt() == null ? null : item.getCreatedAt().toString();
    }
    public Long getId() { return id; }
    public Long getToUserId() { return toUserId; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public String getIcon() { return icon; }
    public String getIconColor() { return iconColor; }
    public String getScreen() { return screen; }
    public String getRelatedId() { return relatedId; }
    public String getReadAt() { return readAt; }
    public String getCreatedAt() { return createdAt; }
}
