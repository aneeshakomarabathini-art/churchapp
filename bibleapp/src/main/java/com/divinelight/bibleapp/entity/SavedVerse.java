package com.divinelight.bibleapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_verses")
public class SavedVerse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String verseId;
    private String book;
    private String chapter;
    private String verse;
    private String reference;
    @Column(length = 3000)
    private String text;
    private String language;
    private String version;
    private LocalDateTime savedAt;

    @PrePersist
    public void onCreate() { savedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getVerseId() { return verseId; }
    public void setVerseId(String verseId) { this.verseId = verseId; }
    public String getBook() { return book; }
    public void setBook(String book) { this.book = book; }
    public String getChapter() { return chapter; }
    public void setChapter(String chapter) { this.chapter = chapter; }
    public String getVerse() { return verse; }
    public void setVerse(String verse) { this.verse = verse; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public LocalDateTime getSavedAt() { return savedAt; }
}
