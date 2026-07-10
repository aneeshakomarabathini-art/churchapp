package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.SavedVerse;

public class SavedVerseResponse {
    private Long savedId;
    private String id;
    private String type = "verse";
    private String title;
    private String reference;
    private String text;
    private String book;
    private String chapter;
    private String verseNum;
    private String language;
    private String version;
    private String savedAt;
    public SavedVerseResponse(SavedVerse item) {
        this.savedId = item.getId();
        this.id = item.getVerseId();
        this.title = item.getReference();
        this.reference = item.getReference();
        this.text = item.getText();
        this.book = item.getBook();
        this.chapter = item.getChapter();
        this.verseNum = item.getVerse();
        this.language = item.getLanguage();
        this.version = item.getVersion();
        this.savedAt = item.getSavedAt() == null ? null : item.getSavedAt().toString();
    }
    public Long getSavedId() { return savedId; }
    public String getId() { return id; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getReference() { return reference; }
    public String getText() { return text; }
    public String getBook() { return book; }
    public String getChapter() { return chapter; }
    public String getVerseNum() { return verseNum; }
    public String getLanguage() { return language; }
    public String getVersion() { return version; }
    public String getSavedAt() { return savedAt; }
}
