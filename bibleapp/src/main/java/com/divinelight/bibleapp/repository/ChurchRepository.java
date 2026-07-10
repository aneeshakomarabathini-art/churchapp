package com.divinelight.bibleapp.repository;

import com.divinelight.bibleapp.entity.Church;
import com.divinelight.bibleapp.entity.ChurchStatus;
import com.divinelight.bibleapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChurchRepository extends JpaRepository<Church, Long> {
    List<Church> findByStatusOrderByCreatedAtDesc(ChurchStatus status);
    List<Church> findByStatus(ChurchStatus status);
    Optional<Church> findByAdminUser(User adminUser);
}
