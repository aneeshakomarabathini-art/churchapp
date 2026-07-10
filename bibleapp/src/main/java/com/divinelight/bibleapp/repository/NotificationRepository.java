package com.divinelight.bibleapp.repository;

import com.divinelight.bibleapp.entity.Notification;
import com.divinelight.bibleapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByToUserOrderByCreatedAtDesc(User toUser);
    void deleteByToUser(User toUser);
}
