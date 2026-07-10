package com.divinelight.bibleapp.repository;

import com.divinelight.bibleapp.entity.SavedVerse;
import com.divinelight.bibleapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedVerseRepository extends JpaRepository<SavedVerse, Long> {
    List<SavedVerse> findByUserOrderBySavedAtDesc(User user);
    Optional<SavedVerse> findByUserAndVerseId(User user, String verseId);
    boolean existsByUserAndVerseId(User user, String verseId);
}
