package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.MatrimonyInterest;

public class MatrimonyInterestResponse {
    private Long id;
    private Long fromUserId;
    private Long toUserId;
    private String fromName;
    private String toName;
    private String status;
    private String createdAt;
    private MatrimonyProfileResponse profile;

    public MatrimonyInterestResponse(MatrimonyInterest interest, String baseUrl, boolean receivedSide) {
        this.id = interest.getId();
        this.fromUserId = interest.getFromProfile().getUser().getId();
        this.toUserId = interest.getToProfile().getUser().getId();
        this.fromName = interest.getFromProfile().getName();
        this.toName = interest.getToProfile().getName();
        this.status = interest.getStatus() == null ? null : interest.getStatus().name().toLowerCase();
        this.createdAt = interest.getCreatedAt() == null ? null : interest.getCreatedAt().toString();
        this.profile = new MatrimonyProfileResponse(receivedSide ? interest.getFromProfile() : interest.getToProfile(), baseUrl, false, false, false, false);
    }
    public Long getId() { return id; }
    public Long getFromUserId() { return fromUserId; }
    public Long getToUserId() { return toUserId; }
    public String getFromName() { return fromName; }
    public String getToName() { return toName; }
    public String getStatus() { return status; }
    public String getCreatedAt() { return createdAt; }
    public MatrimonyProfileResponse getProfile() { return profile; }
}
