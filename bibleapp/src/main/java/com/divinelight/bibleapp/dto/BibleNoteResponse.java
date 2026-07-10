package com.divinelight.bibleapp.dto;

import com.divinelight.bibleapp.entity.BibleNote;

public class BibleNoteResponse {
    private Long dbId;
    private String id;
    private String note;
    private String reference;
    private String text;
    private String book;
    private String chapter;
    private String verseNum;
    private String language;
    private String version;
    private String updatedAt;
    public BibleNoteResponse(BibleNote item) {
        this.dbId = item.getId();
        this.id = item.getVerseId();
        this.note = item.getNote();
        this.reference = item.getReference();
        this.text = item.getVerseText();
        this.book = item.getBook();
        this.chapter = item.getChapter();
        this.verseNum = item.getVerse();
        this.language = item.getLanguage();
        this.version = item.getVersion();
        this.updatedAt = item.getUpdatedAt() == null ? null : item.getUpdatedAt().toString();
    }
    public Long getDbId() { return dbId; }
    public String getId() { return id; }
    public String getNote() { return note; }
    public String getReference() { return reference; }
    public String getText() { return text; }
    public String getBook() { return book; }
    public String getChapter() { return chapter; }
    public String getVerseNum() { return verseNum; }
    public String getLanguage() { return language; }
    public String getVersion() { return version; }
    public String getUpdatedAt() { return updatedAt; }
}
