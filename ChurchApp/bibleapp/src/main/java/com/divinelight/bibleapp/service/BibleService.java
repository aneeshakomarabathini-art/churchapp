package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.*;
import com.divinelight.bibleapp.entity.BibleNote;
import com.divinelight.bibleapp.entity.SavedVerse;
import com.divinelight.bibleapp.entity.User;
import com.divinelight.bibleapp.repository.BibleNoteRepository;
import com.divinelight.bibleapp.repository.SavedVerseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BibleService {
    private final SavedVerseRepository savedVerseRepository;
    private final BibleNoteRepository noteRepository;

    private record DailyVerse(String book, String chapter, String verse, String text) {}

    private static final List<DailyVerse> DAILY_VERSES = List.of(
            new DailyVerse("John", "3", "16", "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."),
            new DailyVerse("Philippians", "4", "13", "I can do all things through Christ which strengtheneth me."),
            new DailyVerse("Psalm", "23", "1", "The Lord is my shepherd; I shall not want."),
            new DailyVerse("Proverbs", "3", "5", "Trust in the Lord with all thine heart; and lean not unto thine own understanding."),
            new DailyVerse("Jeremiah", "29", "11", "For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil."),
            new DailyVerse("Romans", "8", "28", "And we know that all things work together for good to them that love God."),
            new DailyVerse("Isaiah", "41", "10", "Fear thou not; for I am with thee: be not dismayed; for I am thy God."),
            new DailyVerse("Matthew", "11", "28", "Come unto me, all ye that labour and are heavy laden, and I will give you rest."),
            new DailyVerse("Psalm", "46", "1", "God is our refuge and strength, a very present help in trouble."),
            new DailyVerse("Joshua", "1", "9", "Be strong and of a good courage; be not afraid, neither be thou dismayed."),
            new DailyVerse("Psalm", "119", "105", "Thy word is a lamp unto my feet, and a light unto my path."),
            new DailyVerse("2 Corinthians", "5", "7", "For we walk by faith, not by sight."),
            new DailyVerse("1 Peter", "5", "7", "Casting all your care upon him; for he careth for you."),
            new DailyVerse("Psalm", "37", "4", "Delight thyself also in the Lord; and he shall give thee the desires of thine heart."),
            new DailyVerse("Romans", "12", "2", "And be not conformed to this world: but be ye transformed by the renewing of your mind."),
            new DailyVerse("Isaiah", "40", "31", "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles."),
            new DailyVerse("John", "14", "27", "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you."),
            new DailyVerse("Psalm", "27", "1", "The Lord is my light and my salvation; whom shall I fear?"),
            new DailyVerse("Hebrews", "11", "1", "Now faith is the substance of things hoped for, the evidence of things not seen."),
            new DailyVerse("Ephesians", "2", "8", "For by grace are ye saved through faith; and that not of yourselves: it is the gift of God."),
            new DailyVerse("Galatians", "5", "22", "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith."),
            new DailyVerse("Psalm", "34", "8", "O taste and see that the Lord is good: blessed is the man that trusteth in him."),
            new DailyVerse("Matthew", "6", "33", "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."),
            new DailyVerse("James", "1", "5", "If any of you lack wisdom, let him ask of God, that giveth to all men liberally."),
            new DailyVerse("1 John", "4", "19", "We love him, because he first loved us."),
            new DailyVerse("Psalm", "91", "1", "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty."),
            new DailyVerse("Romans", "15", "13", "Now the God of hope fill you with all joy and peace in believing."),
            new DailyVerse("Colossians", "3", "23", "And whatsoever ye do, do it heartily, as to the Lord, and not unto men."),
            new DailyVerse("1 Thessalonians", "5", "16", "Rejoice evermore."),
            new DailyVerse("1 Thessalonians", "5", "17", "Pray without ceasing."),
            new DailyVerse("Psalm", "118", "24", "This is the day which the Lord hath made; we will rejoice and be glad in it."),
            new DailyVerse("Micah", "6", "8", "What doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?"),
            new DailyVerse("Deuteronomy", "31", "6", "Be strong and of a good courage, fear not, nor be afraid of them."),
            new DailyVerse("Psalm", "55", "22", "Cast thy burden upon the Lord, and he shall sustain thee."),
            new DailyVerse("John", "15", "5", "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit."),
            new DailyVerse("Romans", "10", "9", "That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart... thou shalt be saved."),
            new DailyVerse("Psalm", "121", "1", "I will lift up mine eyes unto the hills, from whence cometh my help."),
            new DailyVerse("Psalm", "121", "2", "My help cometh from the Lord, which made heaven and earth."),
            new DailyVerse("Luke", "1", "37", "For with God nothing shall be impossible."),
            new DailyVerse("Matthew", "5", "16", "Let your light so shine before men, that they may see your good works, and glorify your Father."),
            new DailyVerse("Psalm", "19", "14", "Let the words of my mouth, and the meditation of my heart, be acceptable in thy sight."),
            new DailyVerse("2 Timothy", "1", "7", "For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind."),
            new DailyVerse("Hebrews", "13", "8", "Jesus Christ the same yesterday, and to day, and for ever."),
            new DailyVerse("James", "4", "8", "Draw nigh to God, and he will draw nigh to you."),
            new DailyVerse("Psalm", "103", "2", "Bless the Lord, O my soul, and forget not all his benefits."),
            new DailyVerse("Matthew", "28", "20", "Lo, I am with you alway, even unto the end of the world. Amen."),
            new DailyVerse("John", "8", "12", "I am the light of the world: he that followeth me shall not walk in darkness."),
            new DailyVerse("Revelation", "3", "20", "Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in."),
            new DailyVerse("Psalm", "100", "4", "Enter into his gates with thanksgiving, and into his courts with praise."),
            new DailyVerse("Nahum", "1", "7", "The Lord is good, a strong hold in the day of trouble; and he knoweth them that trust in him.")
    );

    public BibleService(SavedVerseRepository savedVerseRepository, BibleNoteRepository noteRepository) {
        this.savedVerseRepository = savedVerseRepository;
        this.noteRepository = noteRepository;
    }

    public VerseOfDayResponse verseOfDay(User user, String language, String version) {
        if (user == null || user.getId() == null) throw new RuntimeException("Login required for verse of the day");

        LocalDate today = LocalDate.now();
        long userSeed = user.getId() * 31L;
        long daySeed = today.toEpochDay() * 17L;
        int index = Math.floorMod((int) (userSeed + daySeed), DAILY_VERSES.size());
        DailyVerse verse = DAILY_VERSES.get(index);

        String safeLanguage = blank(language) ? "english" : language.trim().toLowerCase();
        String safeVersion = blank(version) ? "kjv" : version.trim().toLowerCase();
        String reference = buildReference(verse.book(), verse.chapter(), verse.verse());
        String verseId = (verse.book() + "-" + verse.chapter() + "-" + verse.verse()).replace(" ", "_");

        return new VerseOfDayResponse(
                verseId,
                verse.book(),
                verse.chapter(),
                verse.verse(),
                reference,
                verse.text(),
                safeLanguage,
                safeVersion,
                today.toString()
        );
    }

    public List<SavedVerseResponse> savedVerses(User user) {
        return savedVerseRepository.findByUserOrderBySavedAtDesc(user).stream().map(SavedVerseResponse::new).toList();
    }

    public SavedVerseResponse saveVerse(User user, SavedVerseRequest request) {
        if (request == null || blank(request.getVerseId())) throw new RuntimeException("Verse id is required");
        SavedVerse item = savedVerseRepository.findByUserAndVerseId(user, request.getVerseId()).orElseGet(SavedVerse::new);
        item.setUser(user);
        item.setVerseId(request.getVerseId());
        item.setBook(request.getBook());
        item.setChapter(request.getChapter() == null ? "" : request.getChapter());
        item.setVerse(request.getVerse() != null ? request.getVerse() : request.getVerseNum());
        item.setReference(blank(request.getReference()) ? buildReference(request.getBook(), request.getChapter(), item.getVerse()) : request.getReference());
        item.setText(request.getText());
        item.setLanguage(request.getLanguage());
        item.setVersion(request.getVersion());
        return new SavedVerseResponse(savedVerseRepository.save(item));
    }

    public void deleteSavedVerse(User user, String verseIdOrDbId) {
        SavedVerse item = savedVerseRepository.findByUserAndVerseId(user, verseIdOrDbId).orElse(null);
        if (item == null) {
            try {
                Long id = Long.parseLong(verseIdOrDbId);
                item = savedVerseRepository.findById(id).orElse(null);
            } catch (Exception ignored) {}
        }
        if (item != null && item.getUser().getId().equals(user.getId())) savedVerseRepository.delete(item);
    }

    public List<BibleNoteResponse> notes(User user) {
        return noteRepository.findByUserOrderByUpdatedAtDesc(user).stream().map(BibleNoteResponse::new).toList();
    }

    public BibleNoteResponse saveNote(User user, BibleNoteRequest request) {
        if (request == null || blank(request.getVerseId())) throw new RuntimeException("Verse id is required");
        if (blank(request.getNote())) {
            deleteNote(user, request.getVerseId());
            return null;
        }
        BibleNote note = noteRepository.findByUserAndVerseId(user, request.getVerseId()).orElseGet(BibleNote::new);
        note.setUser(user);
        note.setVerseId(request.getVerseId());
        note.setBook(request.getBook());
        note.setChapter(request.getChapter() == null ? "" : request.getChapter());
        note.setVerse(request.getVerse() != null ? request.getVerse() : request.getVerseNum());
        note.setReference(blank(request.getReference()) ? buildReference(request.getBook(), request.getChapter(), note.getVerse()) : request.getReference());
        note.setVerseText(request.getVerseText());
        note.setNote(request.getNote());
        note.setLanguage(request.getLanguage());
        note.setVersion(request.getVersion());
        return new BibleNoteResponse(noteRepository.save(note));
    }

    public BibleNoteResponse updateNote(User user, Long id, BibleNoteRequest request) {
        BibleNote note = noteRepository.findById(id).orElseThrow(() -> new RuntimeException("Note not found"));
        if (!note.getUser().getId().equals(user.getId())) throw new RuntimeException("Note not found");
        if (request == null || blank(request.getNote())) throw new RuntimeException("Note is required");
        note.setNote(request.getNote());
        return new BibleNoteResponse(noteRepository.save(note));
    }

    public void deleteNote(User user, String verseIdOrDbId) {
        BibleNote note = noteRepository.findByUserAndVerseId(user, verseIdOrDbId).orElse(null);
        if (note == null) {
            try {
                Long id = Long.parseLong(verseIdOrDbId);
                note = noteRepository.findById(id).orElse(null);
            } catch (Exception ignored) {}
        }
        if (note != null && note.getUser().getId().equals(user.getId())) noteRepository.delete(note);
    }

    private String buildReference(String book, String chapter, String verse) {
        return (book == null ? "" : book) + " " + (chapter == null ? "" : chapter) + ":" + (verse == null ? "" : verse);
    }

    private boolean blank(String v) { return v == null || v.trim().isEmpty(); }
}
