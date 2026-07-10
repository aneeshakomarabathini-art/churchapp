package com.divinelight.bibleapp.repository;

import com.divinelight.bibleapp.entity.Church;
import com.divinelight.bibleapp.entity.ChurchContent;
import com.divinelight.bibleapp.entity.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChurchContentRepository extends JpaRepository<ChurchContent, Long> {
    List<ChurchContent> findByChurchOrderByCreatedAtDesc(Church church);
    List<ChurchContent> findByChurchAndTypeOrderByCreatedAtDesc(Church church, ContentType type);
    List<ChurchContent> findTop20ByOrderByCreatedAtDesc();
}
