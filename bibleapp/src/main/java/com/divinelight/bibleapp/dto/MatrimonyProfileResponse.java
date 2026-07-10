package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.MatrimonyProfile;

public class MatrimonyProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String age;
    private String gender;
    private String location;
    private String denomination;
    private String occupation;
    private String education;
    private String photoUri;
    private String avatar;
    private String bio;
    private String familyDetails;
    private String phone;
    private String email;
    private boolean contactVisible;
    private boolean sentInterest;
    private boolean receivedInterest;
    private boolean mutualInterest;
    private String createdAt;
    private String updatedAt;

    public MatrimonyProfileResponse(MatrimonyProfile profile, String baseUrl, boolean contactVisible, boolean sentInterest, boolean receivedInterest, boolean mutualInterest) {
        this.id = profile.getId();
        this.userId = profile.getUser() == null ? null : profile.getUser().getId();
        this.name = profile.getName();
        this.age = profile.getAge();
        this.gender = profile.getGender();
        this.location = profile.getLocation();
        this.denomination = profile.getDenomination();
        this.occupation = profile.getOccupation();
        this.education = profile.getEducation();
        this.photoUri = profile.getPhotoPath() == null || profile.getPhotoPath().isBlank() ? "" : baseUrl + profile.getPhotoPath();
        this.avatar = profile.getName() == null || profile.getName().isBlank() ? "?" : profile.getName().substring(0, 1).toUpperCase();
        this.bio = profile.getBio();
        this.familyDetails = profile.getBio();
        this.contactVisible = contactVisible;
        this.sentInterest = sentInterest;
        this.receivedInterest = receivedInterest;
        this.mutualInterest = mutualInterest;
        this.phone = contactVisible ? profile.getPhone() : "";
        this.email = contactVisible ? profile.getEmail() : "";
        this.createdAt = profile.getCreatedAt() == null ? null : profile.getCreatedAt().toString();
        this.updatedAt = profile.getUpdatedAt() == null ? null : profile.getUpdatedAt().toString();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getAge() { return age; }
    public String getGender() { return gender; }
    public String getLocation() { return location; }
    public String getDenomination() { return denomination; }
    public String getOccupation() { return occupation; }
    public String getEducation() { return education; }
    public String getPhotoUri() { return photoUri; }
    public String getAvatar() { return avatar; }
    public String getBio() { return bio; }
    public String getFamilyDetails() { return familyDetails; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public boolean isContactVisible() { return contactVisible; }
    public boolean isSentInterest() { return sentInterest; }
    public boolean isReceivedInterest() { return receivedInterest; }
    public boolean isMutualInterest() { return mutualInterest; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
}
