package com.divinelight.bibleapp.repository;

import com.divinelight.bibleapp.entity.BibleNote;
import com.divinelight.bibleapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BibleNoteRepository extends JpaRepository<BibleNote, Long> {
    List<BibleNote> findByUserOrderByUpdatedAtDesc(User user);
    Optional<BibleNote> findByUserAndVerseId(User user, String verseId);
}
