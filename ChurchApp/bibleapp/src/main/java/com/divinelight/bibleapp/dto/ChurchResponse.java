package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.Church;

public class ChurchResponse {
    private Long id;
    private String name;
    private String location;
    private String address;
    private String phone;
    private String email;
    private String timing;
    private String about;
    private String image;
    private String status;
    private String adminName;
    private String adminEmail;
    private String createdAt;

    public ChurchResponse(Church church, String baseUrl) {
        this.id = church.getId();
        this.name = church.getChurchName();
        this.location = church.getChurchLocation();
        this.address = church.getChurchAddress();
        this.phone = church.getChurchPhone();
        this.email = church.getChurchEmail();
        this.timing = church.getChurchTiming();
        this.about = church.getChurchAbout();
        this.status = church.getStatus() == null ? null : church.getStatus().name().toLowerCase();
        this.createdAt = church.getCreatedAt() == null ? null : church.getCreatedAt().toString();
        this.adminName = church.getAdminUser() == null ? null : church.getAdminUser().getName();
        this.adminEmail = church.getAdminUser() == null ? null : church.getAdminUser().getEmail();
        this.image = church.getChurchPosterPath() == null || church.getChurchPosterPath().isBlank()
                ? "⛪"
                : baseUrl + church.getChurchPosterPath();
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLocation() { return location; }
    public String getAddress() { return address; }
    public String getPhone() { return phone; }
    public String getEmail() { return email; }
    public String getTiming() { return timing; }
    public String getAbout() { return about; }
    public String getImage() { return image; }
    public String getStatus() { return status; }
    public String getAdminName() { return adminName; }
    public String getAdminEmail() { return adminEmail; }
    public String getCreatedAt() { return createdAt; }
}
