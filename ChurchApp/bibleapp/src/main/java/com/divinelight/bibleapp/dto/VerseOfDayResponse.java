package com.divinelight.bibleapp.dto;

public class VerseOfDayResponse {
    private String verseId;
    private String book;
    private String chapter;
    private String verse;
    private String verseNum;
    private String reference;
    private String text;
    private String language;
    private String version;
    private String date;

    public VerseOfDayResponse() {
    }

    public VerseOfDayResponse(String verseId, String book, String chapter, String verse, String reference, String text, String language, String version, String date) {
        this.verseId = verseId;
        this.book = book;
        this.chapter = chapter;
        this.verse = verse;
        this.verseNum = verse;
        this.reference = reference;
        this.text = text;
        this.language = language;
        this.version = version;
        this.date = date;
    }

    public String getVerseId() { return verseId; }
    public void setVerseId(String verseId) { this.verseId = verseId; }

    public String getBook() { return book; }
    public void setBook(String book) { this.book = book; }

    public String getChapter() { return chapter; }
    public void setChapter(String chapter) { this.chapter = chapter; }

    public String getVerse() { return verse; }
    public void setVerse(String verse) { this.verse = verse; this.verseNum = verse; }

    public String getVerseNum() { return verseNum; }
    public void setVerseNum(String verseNum) { this.verseNum = verseNum; this.verse = verseNum; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
