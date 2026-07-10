package com.divinelight.bibleapp.repository;

import com.divinelight.bibleapp.entity.MatrimonyProfile;
import com.divinelight.bibleapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MatrimonyProfileRepository extends JpaRepository<MatrimonyProfile, Long> {
    Optional<MatrimonyProfile> findByUser(User user);
    Optional<MatrimonyProfile> findByUserId(Long userId);
    List<MatrimonyProfile> findAllByOrderByCreatedAtDesc();
}
