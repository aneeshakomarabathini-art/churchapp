package com.divinelight.bibleapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "churches")
public class Church {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String churchName;
    private String churchLocation;

    @Column(length = 1500)
    private String churchAddress;

    private String churchPhone;
    private String churchEmail;
    private String churchTiming;

    @Column(length = 3000)
    private String churchAbout;

    private String churchPosterPath;

    @Enumerated(EnumType.STRING)
    private ChurchStatus status;

    @OneToOne
    @JoinColumn(name = "admin_user_id")
    private User adminUser;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ChurchStatus.PENDING;
    }

    @PreUpdate
    public void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public String getChurchName() { return churchName; }
    public void setChurchName(String churchName) { this.churchName = churchName; }
    public String getChurchLocation() { return churchLocation; }
    public void setChurchLocation(String churchLocation) { this.churchLocation = churchLocation; }
    public String getChurchAddress() { return churchAddress; }
    public void setChurchAddress(String churchAddress) { this.churchAddress = churchAddress; }
    public String getChurchPhone() { return churchPhone; }
    public void setChurchPhone(String churchPhone) { this.churchPhone = churchPhone; }
    public String getChurchEmail() { return churchEmail; }
    public void setChurchEmail(String churchEmail) { this.churchEmail = churchEmail; }
    public String getChurchTiming() { return churchTiming; }
    public void setChurchTiming(String churchTiming) { this.churchTiming = churchTiming; }
    public String getChurchAbout() { return churchAbout; }
    public void setChurchAbout(String churchAbout) { this.churchAbout = churchAbout; }
    public String getChurchPosterPath() { return churchPosterPath; }
    public void setChurchPosterPath(String churchPosterPath) { this.churchPosterPath = churchPosterPath; }
    public ChurchStatus getStatus() { return status; }
    public void setStatus(ChurchStatus status) { this.status = status; }
    public User getAdminUser() { return adminUser; }
    public void setAdminUser(User adminUser) { this.adminUser = adminUser; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
