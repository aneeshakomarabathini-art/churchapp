package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.Church;
import com.divinelight.bibleapp.entity.User;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String status;
    private Long churchId;
    private String churchName;
    private String churchLocation;
    private String churchAddress;
    private String churchPhone;
    private String createdAt;

    public UserResponse() {}
    public UserResponse(User user) { this(user, null); }
    public UserResponse(User user, Church church) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.role = user.getRole() == null ? null : user.getRole().name();
        this.status = user.getStatus() == null ? null : user.getStatus().name();
        this.createdAt = user.getCreatedAt() == null ? null : user.getCreatedAt().toString();
        if (church != null) {
            this.churchId = church.getId();
            this.churchName = church.getChurchName();
            this.churchLocation = church.getChurchLocation();
            this.churchAddress = church.getChurchAddress();
            this.churchPhone = church.getChurchPhone();
        }
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getRole() { return role; }
    public String getStatus() { return status; }
    public Long getChurchId() { return churchId; }
    public String getChurchName() { return churchName; }
    public String getChurchLocation() { return churchLocation; }
    public String getChurchAddress() { return churchAddress; }
    public String getChurchPhone() { return churchPhone; }
    public String getCreatedAt() { return createdAt; }
}
