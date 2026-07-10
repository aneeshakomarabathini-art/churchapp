package com.divinelight.bibleapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matrimony_interests")
public class MatrimonyInterest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_profile_id")
    private MatrimonyProfile fromProfile;

    @ManyToOne
    @JoinColumn(name = "to_profile_id")
    private MatrimonyProfile toProfile;

    @Enumerated(EnumType.STRING)
    private InterestStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); if (status == null) status = InterestStatus.SENT; }
    @PreUpdate
    public void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public MatrimonyProfile getFromProfile() { return fromProfile; }
    public void setFromProfile(MatrimonyProfile fromProfile) { this.fromProfile = fromProfile; }
    public MatrimonyProfile getToProfile() { return toProfile; }
    public void setToProfile(MatrimonyProfile toProfile) { this.toProfile = toProfile; }
    public InterestStatus getStatus() { return status; }
    public void setStatus(InterestStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
