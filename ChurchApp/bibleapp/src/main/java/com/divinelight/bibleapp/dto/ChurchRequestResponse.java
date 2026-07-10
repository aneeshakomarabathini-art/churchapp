package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.Church;

public class ChurchRequestResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String churchName;
    private String churchLocation;
    private String churchAddress;
    private String churchPhone;
    private String churchEmail;
    private String churchTiming;
    private String churchAbout;
    private String status;
    private String createdAt;

    public ChurchRequestResponse(Church church) {
        this.id = church.getId();
        this.name = church.getAdminUser() == null ? "" : church.getAdminUser().getName();
        this.email = church.getAdminUser() == null ? "" : church.getAdminUser().getEmail();
        this.phone = church.getAdminUser() == null ? "" : church.getAdminUser().getPhone();
        this.churchName = church.getChurchName();
        this.churchLocation = church.getChurchLocation();
        this.churchAddress = church.getChurchAddress();
        this.churchPhone = church.getChurchPhone();
        this.churchEmail = church.getChurchEmail();
        this.churchTiming = church.getChurchTiming();
        this.churchAbout = church.getChurchAbout();
        this.status = church.getStatus() == null ? "" : church.getStatus().name().toLowerCase();
        this.createdAt = church.getCreatedAt() == null ? null : church.getCreatedAt().toString();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getChurchName() { return churchName; }
    public String getChurchLocation() { return churchLocation; }
    public String getChurchAddress() { return churchAddress; }
    public String getChurchPhone() { return churchPhone; }
    public String getChurchEmail() { return churchEmail; }
    public String getChurchTiming() { return churchTiming; }
    public String getChurchAbout() { return churchAbout; }
    public String getStatus() { return status; }
    public String getCreatedAt() { return createdAt; }
}
