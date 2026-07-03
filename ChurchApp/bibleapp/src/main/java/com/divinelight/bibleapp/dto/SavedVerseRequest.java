package com.divinelight.bibleapp.dto;

public class SavedVerseRequest {
    private String verseId;
    private String book;
    private String chapter;
    private String verse;
    private String verseNum;
    private String reference;
    private String text;
    private String language;
    private String version;
    public String getVerseId() { return verseId; }
    public void setVerseId(String verseId) { this.verseId = verseId; }
    public String getBook() { return book; }
    public void setBook(String book) { this.book = book; }
    public String getChapter() { return chapter; }
    public void setChapter(String chapter) { this.chapter = chapter; }
    public String getVerse() { return verse; }
    public void setVerse(String verse) { this.verse = verse; }
    public String getVerseNum() { return verseNum; }
    public void setVerseNum(String verseNum) { this.verseNum = verseNum; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
}
